import { camelCaseObjectToSnakeCase, snakeCaseObjectToCamelCase } from '@/helpers/general'
import fetcher from '@/lib/fetcher'
import type { FetcherOptions } from '@/lib/fetcher/types'

const scheme = import.meta.env.VITE_SSL_ENABLED === 'true' ? 'https' : 'http'

const carshenasOptions = {
  baseURL: `${scheme}://${import.meta.env.VITE_API_SERVER}`
}

export default {
  get: async <R = unknown, D = unknown>(url: string, options?: FetcherOptions<D>) => {
    const result = await fetcher.get<R, D>(url, {
      ...options,
      parameters: camelCaseObjectToSnakeCase(options?.parameters as any) as URLSearchParams,
      ...carshenasOptions
    })

    return {
      ...result,
      data: snakeCaseObjectToCamelCase(result.data as any) as any
    }
  },
  post: async <R = unknown, D = unknown>(url: string, options?: FetcherOptions<D>) => {
    const result = await fetcher.post<R, D>(url, {
      ...options,
      body: camelCaseObjectToSnakeCase(options?.body as any) as any,
      ...carshenasOptions
    })

    return {
      ...result,
      data: snakeCaseObjectToCamelCase(result.data as any) as any
    }
  }
}
