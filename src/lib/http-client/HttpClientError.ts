import { isNetworkError } from './helpers'
import type { HttpClientRequestConfig, HttpClientResponse } from './types'

export default class HttpClientError<D = unknown, E = unknown> extends Error {
  message: string

  public name: string = 'HttpClientError'
  public url: string | null = null
  public response?: HttpClientResponse<D, E> | null = null
  public config?: HttpClientRequestConfig<D> | null = null

  constructor(
    url: string | null,
    response?: HttpClientResponse<D, E>,
    config?: HttpClientRequestConfig<D>,
    error?: any
  ) {
    const message = response
      ? `Request failed with status code ${response.status}`
      : isNetworkError(error)
        ? 'ERR_NETWORK'
        : 'ERR_UNKNOWN'
    super(message)

    this.message = message
    this.url = url
    this.response = response
    this.config = config
  }
}
