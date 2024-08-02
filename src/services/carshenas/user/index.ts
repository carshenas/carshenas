import type { User, UserUpdate } from '@/types/dto/user'
import carshenasService from '@/services'

export const getUser = () => carshenasService.get<User[]>('/user/profile/')

export const updateUserService = (body: UserUpdate) =>
  carshenasService.put<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>('/user/profile/', {
    body
  })
