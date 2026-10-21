"use strict";
const {onDocumentUpdated}=require("firebase-functions/v2/firestore");
const {initializeApp}=require("firebase-admin/app");
const {getFirestore}=require("firebase-admin/firestore");
const {getMessaging}=require("firebase-admin/messaging");
initializeApp();
exports.notifyNewChallenge=onDocumentUpdated({document:"players/{playerId}",region:"europe-west1"},async event=>{
 const before=event.data?.before?.data();
 const after=event.data?.after?.data();
 if(!after?.challenge?.nonce||after.challenge.nonce===before?.challenge?.nonce)return;
 const playerId=event.params.playerId;
 const tokenDoc=await getFirestore().doc("pushTokens/"+playerId).get();
 const token=tokenDoc.data()?.token;
 if(!token)return;
 const title="🎯 Nouveau défi !";
 const body="La Bodega de Valou : "+String(after.challenge.title||"Un défi t'attend !").slice(0,110);
 try{
  await getMessaging().send({
   token,
   data:{title,body,url:"https://vajeux48-collab.github.io/bodega-valou/"}
  });
 }catch(err){
  if(["messaging/registration-token-not-registered","messaging/invalid-registration-token"].includes(err.code)){
   await tokenDoc.ref.delete();
   return;
  }
  console.error("Erreur FCM",playerId,err);
  throw err;
 }
});
