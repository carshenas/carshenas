import type { HttpClientHeaders, HttpClientParams } from '@/lib/http-client/types'

export interface ServiceBaseOptions {
  params?: HttpClientParams
  headers?: HttpClientHeaders
}

export interface ServiceGetOptions extends ServiceBaseOptions {}

export interface ServicePostOptions<D = unknown> extends ServiceBaseOptions {
  data?: D
}

export interface ServicePatchOptions<D = unknown> extends ServiceBaseOptions {
  data?: D
}

export interface ServiceDeleteOptions<D = unknown> extends ServiceBaseOptions {
  data?: D
}

export interface ServicePutOptions<D = unknown> extends ServiceBaseOptions {
  data?: D
}
