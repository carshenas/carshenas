import type { FetcherOptions, FetchPath, FetchResponse } from './types'
import { generateURL, mergeOptions } from './helpers'

const useFetch = async <R = unknown, D = unknown>(
  path: FetchPath,
  options?: FetcherOptions
): Promise<FetchResponse<R>> => {
  const url = generateURL(path, { baseURL: options?.baseURL, parameters: options?.parameters })
  const mergedOptions = mergeOptions(options)

  try {
    const response = await fetch(url, mergedOptions)
    return statusChecker<R>(response)
  } catch (e) {
    throw new Error(e as string)
  }
}

const statusChecker = async <R>(response: Response) => {
  if (response.ok) {
    return Promise.resolve(await formattedResponse<R>(response))
  }

  throw new Error()
}

const formattedResponse = async <R>(response: Response): Promise<FetchResponse<R>> => ({
  data: (await normalizeResponseData(response)) as R,
  status: response.status,
  statusText: response.statusText,
  headers: response.headers
})

const normalizeResponseData = async (response: Response) => {
  try {
    return await response.json()
  } catch {
    try {
      return await response.text()
    } catch {
      return null
    }
  }
}

export default useFetch
