const firebaseConfig = {
  apiKey: "AIzaSyCLSjKvPjS3h70bD9JZAztDxCxEHSsVDN0",
  authDomain: "carshenas-49efe.firebaseapp.com",
  projectId: "carshenas-49efe",
  storageBucket: "carshenas-49efe.appspot.com",
  messagingSenderId: "1060917373200",
  appId: "1:1060917373200:web:55a69f87282507dab5dd95",
  measurementId: "G-WP726B7ZB0",
};

/* eslint-disable no-undef */
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title || "New Message";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message",
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: payload.data,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
