import type { NullableString } from '../global'

export interface User {
  id: NullableString
  fullName: NullableString
  image: NullableString
  phoneNumber: NullableString
  email: NullableString
  nationalId: NullableString
  token: NullableString
  refreshToken: NullableString
}
