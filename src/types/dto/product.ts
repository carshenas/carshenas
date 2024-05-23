export interface Product {
  id: number
  image: string
  title: string
  description: string
  price: number
  quantity: number
  stock: number
}

export interface ProductFilter extends Record<string, string> {
  title: string
}
