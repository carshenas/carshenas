import type { User, UserUpdate } from '@/types/dto/user'
import carshenasService from '@/services'

export const getUser = () => carshenasService.get<User>('/user/profile/')

export const updateUserService = (data: UserUpdate) => {
  const formData = new FormData()

  if (data.firstName) formData.append('first_name', data.firstName)
  if (data.lastName) formData.append('last_name', data.lastName)
  if (data.nationalCode) formData.append('national_code', data.nationalCode)

  return carshenasService.put<Pick<User, 'firstName' | 'lastName' | 'nationalCode'>>(
    '/user/profile/',
    {
      body: formData
    }
  )
}
