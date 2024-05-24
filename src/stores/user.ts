import { defineStore } from 'pinia'
import { ref } from 'vue'

// types
import type { User } from '@/types/dto/user'

export const useUserStore = defineStore('user', () => {
  const userInit = {
    id: null,
    fullName: null,
    image: null,
    phoneNumber: null,
    email: null,
    nationalId: null,
    token: null,
    refreshToken: null
  }

  const storedUserData = localStorage.user ? JSON.parse(localStorage.user) : userInit
  const user = ref<User>(storedUserData)

  const updateStoredData = (): void => {
    localStorage.user = JSON.stringify(user.value)
  }

  const wipeUserData = () => {
    user.value = userInit
    localStorage.removeItem('user')
  }

  return { user, updateStoredData, wipeUserData }
})
