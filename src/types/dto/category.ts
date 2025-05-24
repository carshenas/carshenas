export interface Category {
  id: number
  image: string
  name: string
  children?: Category[]
  parentId?: number;
  parentName?: string;
  grandparentId?: number;
  grandparentName?: string;
}

export interface CategoryFilter extends URLSearchParams {
  title?: string
}
