import type { CamelizeObjectKeys, DecamelizeObjectKeys } from '@/types/utilities'
import { isArray, camelCase, isObject, transform, snakeCase } from 'lodash'

export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString()
  return +timestamp + Math.floor(Math.random())
}

// export const camelize = <T extends Object[] | Object>(obj: T): CamelizeObjectKeys<T> =>
//   transform(obj, (acc, value, key, target) => {
//     const camelKey: keyof CamelizeObjectKeys<T> = isArray(target)
//       ? (key as keyof CamelizeObjectKeys<T>)
//       : (camelCase(key.toString()) as keyof CamelizeObjectKeys<T>)

//     acc[camelKey] = isObject(value) ? camelize(value) : (value as any)
//   })

// export const decamelize = <T extends Object[] | Object>(obj: T): DecamelizeObjectKeys<T> =>
//   transform(obj, (acc, value, key, target) => {
//     const snakeKey: keyof DecamelizeObjectKeys<T> = isArray(target)
//       ? (key as keyof DecamelizeObjectKeys<T>)
//       : (snakeCase(key.toString()) as keyof DecamelizeObjectKeys<T>)

//     acc[snakeKey] = isObject(value) ? decamelize(value) : (value as any)
//   })

export const camelize = (obj: any): any =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key.toString())

    acc[camelKey] = isObject(value) ? camelize(value) : (value as any)
  })

export const decamelize = (obj: any): any =>
  transform(obj, (acc, value, key, target) => {
    const snakeKey = isArray(target) ? key : snakeCase(key.toString())

    acc[snakeKey] = isObject(value) ? decamelize(value) : (value as any)
  })
