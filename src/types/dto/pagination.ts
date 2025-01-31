// Define a generic Pagination interface
export interface IPaginationParams {
  offset: number
  limit: number
}
export type PaginationParams<T> = IPaginationParams & T

export interface Pagination<T> {
  count: number
  next: string | null
  previous: string | null
  result: T
}
