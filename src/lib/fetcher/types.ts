export type FetchPath = string | Array<string> | URL

export interface FetchOptions extends RequestInit {
  baseURL?: string
  parameters?: Record<string, string>
}

export interface CreateURLOptions {
  baseURL?: string | URL
  parameters?: Record<string, string>
}

export interface FetchResponse<D> {
  data: D
  status: number
  statusText: string
  headers: HeadersInit
}

export type Scheme = 'http' | 'https'
