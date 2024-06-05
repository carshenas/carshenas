import type { SnakeCaseKeys, CamelizeKeys } from '@/types/utilities'

export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString()
  return +timestamp + Math.floor(Math.random())
}

export const camelCaseToSnakeCase = (input: string): string =>
  input.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '_' : '') + $.toLowerCase())

export const snakeToCamelCase = (input: string): string =>
  input.replace(/_(\w)/g, (m) => m[1].toUpperCase())

export const camelCaseObjectToSnakeCase = <D extends object>(object: D) => {
  type Result = Partial<SnakeCaseKeys<D>>
  const snakeCaseObj: Result = {}

  for (const item in object)
    snakeCaseObj[camelCaseToSnakeCase(item) as keyof SnakeCaseKeys<D>] = object[
      item as keyof D
    ] as any

  return snakeCaseObj as object
}

export const snakeCaseObjectToCamelCase = <D extends object>(object: D) => {
  type Result = Partial<CamelizeKeys<D>>
  const camelCaseObj: Result = {}
  for (const item in object)
    camelCaseObj[snakeToCamelCase(item) as keyof CamelizeKeys<D>] = object[item as keyof D] as any

  return camelCaseObj as object
}
