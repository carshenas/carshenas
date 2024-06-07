export type FetchPath = string | Array<string> | URL

export interface FetcherOptions extends RequestInit {
  baseURL?: string
  parameters?: any
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
