/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

/** @type {RegExp[] | undefined} */
let allowlist
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }))

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyCLSjKvPjS3h70bD9JZAztDxCxEHSsVDN0',
  authDomain: 'carshenas-49efe.firebaseapp.com',
  projectId: 'carshenas-49efe',
  storageBucket: 'carshenas-49efe.appspot.com',
  messagingSenderId: '1060917373200',
  appId: '1:1060917373200:web:55a69f87282507dab5dd95',
  measurementId: 'G-WP726B7ZB0'
}

// @ts-ignore
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging so that it can handle background messages
// @ts-ignore
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload: {
  notification: { title: string; body: string }
}) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional: You can set your own icon
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
