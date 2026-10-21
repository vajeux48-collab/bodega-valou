/* Service worker Firebase Messaging — GitHub Pages */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
 apiKey:"AIzaSyB_I_7wrcRaxdjRQw2YbLPjeJKRMcj2s28",
 authDomain:"bodega-valou.firebaseapp.com",
 projectId:"bodega-valou",
 storageBucket:"bodega-valou.firebasestorage.app",
 messagingSenderId:"779911533588",
 appId:"1:779911533588:web:5d79629fdcc3c78cdf0301"
});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
 const title=payload.notification?.title||"🎯 La Bodega de Valou";
 const options={body:payload.notification?.body||"Tu as reçu un nouveau défi !",icon:"./favicon.ico",data:{url:self.registration.scope}};
 self.registration.showNotification(title,options);
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 event.waitUntil(clients.openWindow(event.notification.data?.url||self.registration.scope));
});
