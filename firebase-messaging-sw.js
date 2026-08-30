// firebase-messaging-sw.js
// Place in pwa/ alongside index.html.
// See docs/FIREBASE_SETUP.html Section 11 for full instructions.
//
// TODO: When ready, uncomment everything below and fill in your config:
//
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
//
// firebase.initializeApp({
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// });
//
// const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage(function(payload) {
//   self.registration.showNotification(
//     payload.notification?.title || 'Muallim ul-Quran',
//     {
//       body: payload.notification?.body || payload.data?.message || '',
//       icon: '/muallim/icons/icon-192.png',
//       badge: '/muallim/icons/icon-192.png',
//       tag: 'muallim-broadcast'
//     }
//   );
// });

// Stub: App works fully without this file.
// This file only activates after you configure it (see docs/FIREBASE_SETUP.html).
console.log('[Muallim SW] firebase-messaging-sw.js loaded - configure before use');
