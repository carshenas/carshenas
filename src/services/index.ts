import { camelCaseObjectToSnakeCase, snakeCaseObjectToCamelCase } from '@/helpers/general'
import fetcher from '@/lib/fetcher'
import type { FetcherOptions } from '@/lib/fetcher/types'

const scheme = import.meta.env.VITE_SSL_ENABLED === 'true' ? 'https' : 'http'

const headers = new Headers()

if (localStorage.user) {
  const user = JSON.parse(localStorage.user)
  const token = user.token
  headers.append('Authorization', `Bearer ${token}`)
}

const carshenasOptions = {
  baseURL: `${scheme}://${import.meta.env.VITE_API_SERVER}`,
  headers
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
    if (!(options?.body instanceof FormData)) {
      carshenasOptions.headers.delete('content-type')
      carshenasOptions.headers.append('content-type', 'application/json')
    }
    const result = await fetcher.post<R, D>(url, {
      ...options,
      body:
        options?.body instanceof FormData
          ? options?.body
          : (camelCaseObjectToSnakeCase(options?.body as any) as any),
      ...carshenasOptions
    })
    return {
      ...result,
      data: snakeCaseObjectToCamelCase(result.data as any) as any
    }
  },

  del: async <R = unknown, D = unknown>(url: string, options?: FetcherOptions<D>) => {
    const result = await fetcher.del<R, D>(url, {
      ...options,
      parameters: camelCaseObjectToSnakeCase(options?.parameters as any) as URLSearchParams,
      ...carshenasOptions
    })
  }
}
