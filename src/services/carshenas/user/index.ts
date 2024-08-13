import type { User, UserUpdate } from '@/types/dto/user'
import carshenasService from '@/services'

export const getUser = () => carshenasService.get<User[]>('/user/profile/')

export const updateUserService = (data: {
  firstName?: string
  lastName?: string
  nationalCode?: string
}) => {
  const formData = new FormData()

  if (data.firstName) formData.append('firstName', data.firstName)
  if (data.lastName) formData.append('lastName', data.lastName)
  if (data.nationalCode) formData.append('nationalCode', data.nationalCode)

  return carshenasService.put<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>(
    '/user/profile/',
    {
      body: formData
    }
  )
}
