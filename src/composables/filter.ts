import { useRoute } from 'vue-router'

export const useGetFilterFromURL = <T>() => {
  const route = useRoute()
  return route.query as T
}
