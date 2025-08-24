import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { firebaseConfig } from '@/constants/firebase'
import { submitFCMTokenService } from '@/services/carshenas/firebase'

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

// Store submitted tokens to avoid duplicates
const SUBMITTED_TOKEN_KEY = 'fcm_token_submitted'

const isTokenSubmitted = (token: string): boolean => {
  const submittedToken = localStorage.getItem(SUBMITTED_TOKEN_KEY)
  return submittedToken === token
}

const markTokenAsSubmitted = (token: string): void => {
  localStorage.setItem(SUBMITTED_TOKEN_KEY, token)
}

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // Use the existing service worker registration
      const registration = await navigator.serviceWorker.ready
      
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration
      })
      console.log('FCM Token:', token)
      
      // Submit the token to your backend if not already submitted
      if (token && !isTokenSubmitted(token)) {
        try {
          const response = await submitFCMTokenService(token)
          console.log('FCM Token submitted successfully:', response.data)
          markTokenAsSubmitted(token)
        } catch (error) {
          console.error('Failed to submit FCM token:', error)
          // Don't mark as submitted if it failed, so it can retry
        }
      } else if (token && isTokenSubmitted(token)) {
        console.log('FCM Token already submitted')
      }
      
      return token
    } else {
      console.log('Notification permission denied')
      return null
    }
  } catch (error) {
    console.error('An error occurred while retrieving token.', error)
    return null
  }
}

// Export only the request permission function
export { requestPermission, messaging }
