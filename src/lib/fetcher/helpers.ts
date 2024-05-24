import type { FetchPath, CreateURLOptions, FetcherOptions } from './types'

export const generateURL = (path: FetchPath, options: CreateURLOptions): URL => {
  let baseURL

  if (options.baseURL && !/^[a-z0-9]+:\/\//.test(options.baseURL.toString()))
    baseURL = new URL(options.baseURL)
  else baseURL = new URL(options.baseURL || location.origin)

  const stringifiedUrl = Array.isArray(path) ? path.join('/') : path
  const url = new URL(stringifiedUrl, baseURL)

  const parameters = new URLSearchParams(options.parameters)

  parameters.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return url
}

const bodyNormalizer = <D>(body: D): BodyInit =>
  body instanceof FormData || body instanceof Blob ? body : JSON.stringify(body)

export const mergeOptions = <D = unknown>(options?: FetcherOptions<D>): RequestInit => {
  const result = {
    ...options,
    ...(options?.body ? { body: bodyNormalizer<D>(options?.body) } : {}),
    headers: generateHeaders(options?.headers)
  }
  return result as RequestInit
}

const generateHeaders = (headers?: HeadersInit | undefined) => {
  const mergedHeaders = new Headers(headers)

  return mergedHeaders
}
