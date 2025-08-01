import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types/dto/user'
import { Logout } from '@/services/carshenas/auth'

export const useUserStore = defineStore('user', () => {
  const userInit: User = {
    id: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    nationalCode: null,
    token: null,
    refreshToken: null
  }

  const storedUserData: User = localStorage.user ? JSON.parse(localStorage.user) : userInit
  const user = ref<User>(storedUserData)

  const isLoggedIn = computed((): boolean => user.value.token !== null)

  const updateStoredData = (): void => {
    localStorage.user = JSON.stringify(user.value)
  }

  const wipeUserData = async (): Promise<void> => {
    try {
      // Call logout API if user is logged in
      if (user.value.token) {
        await Logout()
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local data
      user.value = userInit
      localStorage.removeItem('user')
    }
  }

  return { user, isLoggedIn, updateStoredData, wipeUserData }
})
