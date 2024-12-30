import type { ValidationResult, ValidatorValue } from './types'
import { ruleMapper, getMessage } from './rules'
import type { Nullable } from '@/types/utilities'

export default function validator(
  value: ValidatorValue,
  rules: string | string[],
  label?: Nullable<string>
): ValidationResult {
  const rulesArray = Array.isArray(rules) ? rules : rules.split('|')

  const validationResult = rulesArray.map((rule) => {
    const [ruleName, ...ruleParams] = rule.split(':')
    return ruleMapper[ruleName](value, label, ruleParams)
  })

  return (
    validationResult.every((valid) => typeof valid === 'boolean' && valid) ||
    validationResult.find((result) => typeof result === 'string') ||
    getMessage('invalid')
  )
}
