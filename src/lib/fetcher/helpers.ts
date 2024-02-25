import { defaultHeaders } from './defaults'
import type { FetchPath, CreateURLOptions, FetchOptions } from './types'

export const generateURL = (path: FetchPath, options: CreateURLOptions): URL => {
  const baseURL = new URL(options.baseURL || location.origin)

  const stringifiedUrl = Array.isArray(path) ? path.join('/') : path
  const url = new URL(stringifiedUrl, baseURL)

  const parameters = new URLSearchParams(options.parameters)

  parameters.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return url
}

export const mergeOptions = (options: FetchOptions): FetchOptions => ({
  ...options,
  headers: generateHeaders(options.headers)
})

const generateHeaders = (headers: HeadersInit | undefined) => {
  const mergedHeaders = new Headers({ ...defaultHeaders, ...headers })

  return mergedHeaders
}
