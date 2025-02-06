// import { initializeApp } from 'firebase/app'
// import { getMessaging, getToken } from 'firebase/messaging'
// import { firebaseConfig } from '@/constants/firebase'

// const app = initializeApp(firebaseConfig)
// const messaging = getMessaging(app)

// const requestPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission()
//     if (permission === 'granted') {
//       const token = await getToken(messaging, {
//         vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
//       })
//       console.log('FCM Token:', token)
//     } else {
//       console.log('Notification permission denied')
//     }
//   } catch (error) {
//     console.error('An error occurred while retrieving token.', error)
//   }
// }

// const registerServiceWorker = () => {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('/firebase-messaging-sw.js') // This works for both dev and prod
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope)
//         requestPermission()
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error)
//       })
//   }
// }

// export { registerServiceWorker }
