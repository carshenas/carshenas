import carshenasService from '@/services'
import type Posts from '@/types/dto/post'

export const getPostsListService = () => carshenasService.get<Posts[]>('/posts')
