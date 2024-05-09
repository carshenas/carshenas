export interface Category {
  id: number
  image: string
  name: string
  children?: Category[]
}

export interface CategoryFilter extends URLSearchParams {
  title: string
}
