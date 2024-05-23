export type FetchPath = string | Array<string> | URL

export interface FetcherOptions<D> extends Omit<RequestInit, 'body'> {
  baseURL?: string
  body?: D
  parameters?: URLSearchParams
}

export interface CreateURLOptions {
  baseURL?: string | URL
  parameters?: URLSearchParams
}

export interface FetchResponse<R> {
  data: R
  status: number
  statusText: string
  headers: HeadersInit
}

export type Scheme = 'http' | 'https'
