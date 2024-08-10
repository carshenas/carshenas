/// <reference lib="webworker" />

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

import { firebaseConfig } from '@/constants/firebase'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging to handle background messages
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload: { notification: { title: any; body: any } }) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const { title, body } = payload.notification
  const notificationOptions = {
    body,
    icon: '/firebase-logo.png' // Customize with your icon
  }

  self.registration.showNotification(title, notificationOptions)
})

// Handle 'SKIP_WAITING' messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

// Precache and route
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Allowlist for development mode
let allowlist: RegExp[] | undefined
if (import.meta.env.DEV) allowlist = [/^\/$/]

// Register route for offline support
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }))
