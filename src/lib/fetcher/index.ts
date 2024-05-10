import useFetch from './fetcher'
import type { FetcherOptions } from './types'

const get = async <R, D>(path: string, options?: FetcherOptions<D>) =>
  await useFetch<R, D>(path, { ...options, method: 'GET' })
const post = async <R, D>(path: string, options?: FetcherOptions<D>) =>
  await useFetch<R, D>(path, { ...options, method: 'POST' })
const patch = async <R, D>(path: string, options?: FetcherOptions<D>) =>
  await useFetch<R, D>(path, { ...options, method: 'PATCH' })
const put = async <R, D>(path: string, options?: FetcherOptions<D>) =>
  await useFetch<R, D>(path, { ...options, method: 'PUT' })
const delete_ = async <R, D>(path: string, options?: FetcherOptions<D>) =>
  await useFetch<R, D>(path, { ...options, method: 'DELETE' })

export default {
  get,
  post,
  patch,
  put,
  delete: delete_
}
