import type { User, UserUpdate } from '@/types/dto/user'
import carshenasService from '@/services'

export const getUser = () => carshenasService.get<User[]>('/user/profile/')

export const updateUser = (body: UserUpdate) =>
  carshenasService.put<
    {
      firstName: string
      lastName: string
      nationalCode: string
    },
    UserUpdate
  >('/user/profile/', {
    body
  })
