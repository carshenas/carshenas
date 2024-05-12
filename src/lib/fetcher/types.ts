export type FetchPath = string | Array<string> | URL

export interface FetcherOptions<D = BodyInit> extends Omit<RequestInit, 'body'> {
  baseURL?: string
  body?: D
  parameters?: Record<string, string>
}

export interface CreateURLOptions {
  baseURL?: string | URL
  parameters?: Record<string, string>
}

export interface FetchResponse<R = unknown> {
  data: R
  status: number
  statusText: string
  headers: HeadersInit
}

export type Scheme = 'http' | 'https'
