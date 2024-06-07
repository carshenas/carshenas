import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types/dto/user'

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

  const wipeUserData = (): void => {
    user.value = userInit
    localStorage.removeItem('user')
  }

  return { user, isLoggedIn, updateStoredData, wipeUserData }
})
