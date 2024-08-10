<script setup lang="ts">
import TheLayout from '@/layouts/TheLayout.vue'
import { RouterView } from 'vue-router'
// import { onMounted } from 'vue'
// import { messaging, getToken } from '@/plugins/fcm'

// const requestPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission()
//     if (permission === 'granted') {
//       const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
//       console.log('FCM Token:', token)
//     } else {
//       console.log('Notification permission denied')
//     }
//   } catch (error) {
//     console.error('An error occurred while retrieving token.', error)
//   }
// }

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('Service Worker registered with scope:', registration.scope)
//     })
//     .catch((error) => {
//       console.error('Service Worker registration failed:', error)
//     })
// }

// onMounted(() => requestPermission())
</script>

<template>
  <v-app>
    <TheLayout />

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
