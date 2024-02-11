export type NullableString = string | null
export type NullableNumber = number | null
export type NullableBoolean = boolean | null

export interface ElementData {
	id: number
	title: string
}

export interface ElementDescriptionData extends ElementData {
	description: NullableString
}

export interface ElementImageDescriptionData extends ElementDescriptionData {
	image: NullableString
}
