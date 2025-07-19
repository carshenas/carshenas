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
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging to handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(title, notificationOptions);
});
