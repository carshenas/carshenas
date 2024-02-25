import type { Scheme } from './types'

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Accept-Language': 'en-US',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive'
}

export const defaultScheme: Scheme = 'https'
