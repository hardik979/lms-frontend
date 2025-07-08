// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAAudbTvuVZb9WvaOawmuI6jDa1agOSTpQ",
  authDomain: "lms-notification-system.firebaseapp.com",
  projectId: "lms-notification-system",
  storageBucket: "lms-notification-system.firebasestorage.app",
  messagingSenderId: "116207449116",
  appId: "1:116207449116:web:a9e656b9e6b8e6e70b5bd9",
  measurementId: "G-YMMP7MRNFD",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload
  );
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // your app logo or favicon
  });
});
