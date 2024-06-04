import type { NullableString } from '../global'

export interface User {
  id: number | null
  firstName: NullableString
  lastName: NullableString
  phoneNumber: NullableString
  nationalCode: number | null
  token: NullableString
  refreshToken: NullableString
}

export interface UserUpdate {
  firstName?: NullableString
  lastName?: NullableString
  nationalCode?: number | null
}
