import useFetch from './fetcher'
import type { FetchOptions } from './types'

const get = async <D>(path: string, options: FetchOptions) =>
  await useFetch<D>(path, { ...options, method: 'GET' })
const post = async <D>(path: string, options: FetchOptions) =>
  await useFetch<D>(path, { ...options, method: 'POST' })
const patch = async <D>(path: string, options: FetchOptions) =>
  await useFetch<D>(path, { ...options, method: 'PATCH' })
const put = async <D>(path: string, options: FetchOptions) =>
  await useFetch<D>(path, { ...options, method: 'PUT' })
const delete_ = async <D>(path: string, options: FetchOptions) =>
  await useFetch<D>(path, { ...options, method: 'DELETE' })

export default {
  get,
  post,
  patch,
  put,
  delete: delete_
}
