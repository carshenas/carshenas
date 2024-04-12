//@ts-nocheck
import fetcher from '@/lib/fetcher'
import type { FetchOptions } from '@/lib/fetcher/types'

const scheme = import.meta.env.VITE_SSL_ENABLED === true ? 'https' : 'http'

const carShenasOptions = {
  baseURL: `${scheme}://${import.meta.env.VITE_API_SERVER}`
}

export default {
  get: <D>(url: string, options?: FetchOptions) =>
    fetcher.get<D>(url, { ...options, ...carShenasOptions })
}
