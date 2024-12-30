import type { Nullable } from './utilities'

export interface ElementData {
  id: number
  title: string
}

export interface ElementDescriptionData extends ElementData {
  description: Nullable<string>
}

export interface ElementImageDescriptionData extends ElementDescriptionData {
  image: Nullable<string>
}
