export type Camelize<T extends string> = T extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<B>}`
  : T

export type CamelizeKeys<T extends object> = {
  [K in keyof T as K extends string ? Camelize<K> : K]: T[K]
}

// export type SnakeToCamelCaseNested<T> = T extends object
//   ? {
//       [K in keyof T as K extends string ? Camelize<K> : K]: SnakeToCamelCaseNested<T[K]>
//     }
//   : T

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `${Lowercase<T>}_${CamelToSnakeCase<U>}`
    : Lowercase<S>
  : ''

export type SnakeCaseKeys<T extends object> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K]
}

// export type camelToSnakeCaseNested<T> = T extends object
//   ? {
//       [K in keyof T as CamelToSnakeCase<string & K>]: camelToSnakeCaseNested<T[K]>
//     }
//   : T
