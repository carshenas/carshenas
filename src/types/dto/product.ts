export interface Product {
  id: number
  image: string
  title: string
  description: string
  price: number
  quantity: number
  stock: number
}

export interface ProductFilter extends URLSearchParams {
  title: string
}

export interface Variant {
  id: number
  price: number
  stock: number
  is_unlimited: boolean
  specification: Record<string, any>
  brand: string
  warranty: string
  color: Color
  image: string | null
}

export interface Color {
  name: string
  code: string
}

export interface Warranty {
  name: string
  price: number
  color: Color[]
}

export interface Brand {
  name: string
  warranties: Warranty[]
}
