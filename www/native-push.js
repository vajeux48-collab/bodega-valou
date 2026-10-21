import {Capacitor} from "@capacitor/core";
import {FirebaseMessaging} from "@capacitor-firebase/messaging";
import {getApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,setDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

if(Capacitor.isNativePlatform()){
 const button=document.getElementById("nativePushEnable");
 const status=document.getElementById("nativePushStatus");
 button.classList.remove("hidden");
 const app=getApp(),auth=getAuth(app),db=getFirestore(app);
 let token=null;
 async function saveToken(){
  const user=auth.currentUser;
  if(!user||!token)return;
  await setDoc(doc(db,"pushTokens",user.uid),{token,updatedAt:Date.now()});
 }
 button.addEventListener("click",async()=>{
  try{
   let permissions=await FirebaseMessaging.checkPermissions();
   if(permissions.receive!=="granted")permissions=await FirebaseMessaging.requestPermissions();
   if(permissions.receive!=="granted"){status.textContent="Notifications refusées dans les réglages du téléphone.";return}
   const result=await FirebaseMessaging.getToken();
   token=result.token;
   await saveToken();
   status.textContent="🔔 Notifications natives activées sur cet appareil.";
  }catch(error){status.textContent="Impossible d’activer les notifications : "+error.message}
 });
 onAuthStateChanged(auth,()=>{saveToken().catch(error=>console.warn("Token FCM",error))});
 FirebaseMessaging.addListener("tokenReceived",event=>{token=event.token;saveToken().catch(console.error)});
 FirebaseMessaging.addListener("notificationActionPerformed",()=>{document.querySelector('[data-tab="play"]')?.click()});
}
