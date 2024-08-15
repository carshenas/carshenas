// Define a generic Pagination interface
export interface Pagination<T> {
  count: number
  next: string | null
  previous: string | null
  result: T
}
