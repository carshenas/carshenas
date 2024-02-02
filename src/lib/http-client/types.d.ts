export type HttpClientMethod =
	| 'get'
	| 'GET'
	| 'option'
	| 'OPTION'
	| 'post'
	| 'POST'
	| 'put'
	| 'PUT'
	| 'patch'
	| 'PATCH'
	| 'delete'
	| 'DELETE'

export type HttpClientHeaderValue =
	| HttpClientHeaders
	| string
	| string[]
	| number
	| boolean
	| null
	| undefined

export interface HttpClientHeaders {
	[key: string]: HttpClientHeaderValue
}

export type HttpClientParamValue =
	| HttpClientParams
	| string
	| number
	| boolean
	| (string | number | boolean | null | HttpClientParams)[]
	| null

export interface HttpClientParams {
	[key: string]: HttpClientParamValue
}

export interface HttpClientRequestConfig<D = unknown> {
	baseURL?: string
	method?: HttpClientMethod
	headers?: HttpClientHeaders
	params?: HttpClientParams
	data?: D
}

export interface HttpClientResponse<D = unknown, R = unknown> {
	config: HttpClientRequestConfig<D>
	data: R | null
	status: number
	statusText: string
	headers: HttpClientHeaders
}
