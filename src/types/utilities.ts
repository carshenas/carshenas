export type Nullable<T> = T | null

export type Camelize<T extends string> = T extends `${infer A}_${infer B}`
  ? `${A}${Capitalize<B>}`
  : T

export type CamelizeObjectKeys<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T as K extends string ? Camelize<K> : K]: CamelizeObjectKeys<T[K]>
      }
    : T

export type Decamelize<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<Decamelize<U>>}`
  : S

export type DecamelizeObjectKeys<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T as K extends string ? Decamelize<K> : K]: DecamelizeObjectKeys<T[K]>
      }
    : T
