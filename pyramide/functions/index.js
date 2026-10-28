const {onCall,HttpsError}=require("firebase-functions/v2/https");
const admin=require("firebase-admin");
admin.initializeApp();
const db=admin.firestore();
const vals=["A","2","3","4","5","6","7","8","9","10","V","D","R"];
const suits=["♠","♥","♦","♣"];
function fail(message){throw new HttpsError("failed-precondition",message)}
function needAuth(req){if(!req.auth)throw new HttpsError("unauthenticated","Connexion requise");return req.auth.uid}
function cleanRoom(s){s=String(s||"").toUpperCase();if(!/^[A-Z0-9]{6}$/.test(s))fail("Code de salon invalide");return s}
function shuffle(){const d=vals.flatMap(v=>suits.map(s=>({v,s})));for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}
exports.pyramideAction=onCall({region:"europe-west1",maxInstances:10},async req=>{
 const uid=needAuth(req),action=String(req.data?.action||""),room=cleanRoom(req.data?.room);
 const ref=db.doc("pyramideRooms/"+room),privateRef=db.doc("pyramidePrivate/"+room);
 const member=ref.collection("members").doc(uid);
 if(action==="create"){
  const name=String(req.data.name||"").trim().slice(0,22);if(!name)fail("Prénom requis");
  await db.runTransaction(async t=>{if((await t.get(ref)).exists)fail("Code déjà utilisé");t.create(ref,{host:uid,status:"lobby",step:0,current:null,revealed:[],claim:null,createdAt:Date.now()});t.create(member,{name,score:0,joinedAt:Date.now()})});
  return {ok:true};
 }
 if(action==="join"){
  const name=String(req.data.name||"").trim().slice(0,22);if(!name)fail("Prénom requis");
  await db.runTransaction(async t=>{const r=await t.get(ref),m=await t.get(member);if(!r.exists)fail("Salon introuvable");if(m.exists)return;if(r.data().status!=="lobby")fail("Partie déjà commencée");t.create(member,{name,score:0,joinedAt:Date.now()})});
  return {ok:true};
 }
 if(action==="start"){
  const members=await ref.collection("members").get();if(members.size<2||members.size>9)fail("Il faut 2 à 9 joueurs");
  const deck=shuffle(),hands={};for(const m of members.docs)hands[m.id]=deck.splice(0,4);
  await db.runTransaction(async t=>{const r=await t.get(ref);if(!r.exists||r.data().host!==uid||r.data().status!=="lobby")fail("Action refusée");t.create(privateRef,{deck:deck.slice(0,15),hands});t.update(ref,{status:"playing",step:0,current:null,revealed:[],claim:null});for(const [id,cards] of Object.entries(hands))t.set(ref.collection("hands").doc(id),{cards})});
  return {ok:true};
 }
 if(action==="reveal"||action==="skip"){
  await db.runTransaction(async t=>{const [r,p]=await Promise.all([t.get(ref),t.get(privateRef)]);if(!r.exists||r.data().host!==uid||r.data().status!=="playing"||r.data().claim)fail("Action refusée");if(action==="skip"&&!r.data().current)fail("Aucune carte à passer");if(action==="reveal"&&r.data().current)fail("Carte en cours");const n=r.data().step;if(n>=15){t.update(ref,{status:"done",current:null});return}let row=1,left=n;while(left>5-row){left-=5-row;row++}const c=p.data().deck[n];t.update(ref,{step:n+1,current:{...c,row,index:n},revealed:[...(r.data().revealed||[]),{...c,row,index:n}],claim:null})});
  return {ok:true};
 }
 if(action==="announce"){
  const target=String(req.data.target||"");if(target===uid)fail("Choisis un autre joueur");
  await db.runTransaction(async t=>{const [r,from,to]=await Promise.all([t.get(ref),t.get(member),t.get(ref.collection("members").doc(target))]);if(!r.exists||r.data().status!=="playing"||!r.data().current||r.data().claim||!from.exists||!to.exists)fail("Annonce impossible");t.update(ref,{claim:{from:uid,to:target,units:r.data().current.row}})});
  return {ok:true};
 }
 if(action==="resolve"){
  const challenged=Boolean(req.data.challenged);
  await db.runTransaction(async t=>{const [r,p]=await Promise.all([t.get(ref),t.get(privateRef)]);const d=r.data(),c=d?.claim;if(!c||c.to!==uid||!d.current)fail("Décision impossible");const truth=(p.data().hands[c.from]||[]).some(x=>x.v===d.current.v),receiver=challenged?(truth?c.to:c.from):c.to,amount=c.units*(challenged?2:1),mr=ref.collection("members").doc(receiver),m=await t.get(mr);if(!m.exists)fail("Joueur introuvable");t.update(mr,{score:(m.data().score||0)+amount});t.update(ref,{claim:null,current:null,status:d.step>=15?"done":"playing",lastResult:{challenged,truth:challenged?truth:null,receiver,amount,at:Date.now()}})});
  return {ok:true};
 }
 fail("Action inconnue");
});