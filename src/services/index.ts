import { camelCaseObjectToSnakeCase } from '@/helpers/general'
import fetcher from '@/lib/fetcher'
import type { FetcherOptions } from '@/lib/fetcher/types'

//@ts-ignore
const scheme = import.meta.env.VITE_SSL_ENABLED === 'true' ? 'https' : 'http'

const carshenasOptions = {
  //@ts-ignore
  baseURL: `${scheme}://${import.meta.env.VITE_API_SERVER}`
}

export default {
  get: <R = unknown, D = unknown>(url: string, options?: FetcherOptions<D>) =>
    fetcher.get<R, D>(url, { ...options, ...carshenasOptions }),
  post: <R = unknown, D = unknown>(url: string, options?: FetcherOptions<D>) =>
    fetcher.post<R, D>(url, {
      ...options,
      body: camelCaseObjectToSnakeCase(options?.body as Record<string, string>) as D | undefined,
      ...carshenasOptions
    })
}
