import type { Nullable } from '@/types/utilities'

export type ValidatorValue = Nullable<string> | undefined
export type ValidationResult = boolean | string
export interface RuleMapper {
  [k: string]: (
    value: ValidatorValue,
    label?: Nullable<string>,
    params?: string[]
  ) => boolean | string
}
