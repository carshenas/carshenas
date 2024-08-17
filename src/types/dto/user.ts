import type { Nullable } from '@/types/utilities'

export interface User {
  id: number | null
  firstName: Nullable<string>
  lastName: Nullable<string>
  phoneNumber: Nullable<string>
  nationalCode: Nullable<string>
  token: Nullable<string>
  refreshToken: Nullable<string>
}

export interface UserUpdate {
  firstName?: Nullable<string>
  lastName?: Nullable<string>
  nationalCode?: Nullable<string>
}
