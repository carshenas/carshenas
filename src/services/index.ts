//@ts-nocheck
import fetcher from '@/lib/fetcher'
import type { FetchOptions } from '@/lib/fetcher/types'

const scheme = import.meta.env.VITE_SSL_ENABLED === true ? 'https' : 'http'

const carshenasOptions = {
  baseURL: `${scheme}://${import.meta.env.VITE_API_SERVER}`
}

export default {
  get: <D>(url: string, options?: FetchOptions) =>
    fetcher.get<D>(url, { ...options, ...carshenasOptions }),
  post: <D>(url: string, options?: FetchOptions) =>
    fetcher.post<D>(url, {
      ...options,
      body: camelCaseToSnakeCase(options?.body),
      ...carshenasOptions
    })
}
