import type { FetchOptions, FetchPath, FetchResponse } from './types'
import { generateURL, mergeOptions } from './helpers'

const useFetch = async <D = unknown>(path: FetchPath, options?: FetchOptions): Promise<any> => {
  const url = generateURL(path, { baseURL: options?.baseURL, parameters: options?.parameters })
  const mergedOptions = mergeOptions(options)

  try {
    const response = await fetch(url, mergedOptions)
    return statusChecker<D>(response)
  } catch (e) {
    throw new Error(e as string)
  }
}

const statusChecker = async <D>(response: Response) => {
  if (response.ok) {
    return Promise.resolve(await formattedResponse<D>(response))
  }

  throw new Error()
}

const formattedResponse = async <D>(response: Response): Promise<FetchResponse<D>> => ({
  data: (await normalizeResponseData(response)) as D,
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
