import useFetch from './fetcher'
import type { FetcherOptions } from './types'

const get = async <R>(path: string, options?: FetcherOptions) =>
  await useFetch<R>(path, { ...options, method: 'GET' })
const post = async <R>(path: string, options?: FetcherOptions) =>
  await useFetch<R>(path, { ...options, method: 'POST' })
const patch = async <R>(path: string, options?: FetcherOptions) =>
  await useFetch<R>(path, { ...options, method: 'PATCH' })
const put = async <R>(path: string, options?: FetcherOptions) =>
  await useFetch<R>(path, { ...options, method: 'PUT' })
const delete_ = async <R>(path: string, options?: FetcherOptions) =>
  await useFetch<R>(path, { ...options, method: 'DELETE' })

export default {
  get,
  post,
  patch,
  put,
  delete_
}
