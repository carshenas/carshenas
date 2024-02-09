import HttpClientError from './HttpClientError'
import { isObject } from './helpers'
import type { HttpClientRequestConfig, HttpClientHeaders, HttpClientResponse } from './types'

const defaultConfig = {
  method: 'get'
} as HttpClientRequestConfig

const contentTypes = {
  json: 'application/json',
  text: 'text/plain'
}

const defaultContentType = contentTypes.json

export default async function request<D = unknown, R = unknown, E = unknown>(
  url: string | null,
  config?: HttpClientRequestConfig<D>
): Promise<HttpClientResponse<D, R> | null> {
  const mergedConfig = mergeConfig<D>(config, defaultConfig)

  const fullUrl = buildFullUrl(url, mergedConfig)

  try {
    const requestInit = {
      headers: generateHeaders(mergedConfig),
      method: mergedConfig.method?.toUpperCase(),
      body: normalizeBody(mergedConfig)
    } as RequestInit

    const response = await fetch(fullUrl, requestInit)

    return settle<D, R, E>(url, response, mergedConfig)
  } catch (e: any) {
    throw new HttpClientError(url, undefined, config, e)
  }
}

async function settle<D = unknown, R = unknown, E = unknown>(
  url: string | null,
  response: Response,
  config?: HttpClientRequestConfig<D>
) {
  if (response.ok) {
    return Promise.resolve(await transformResponse<D, R>(response, config))
  }

  throw new HttpClientError<D, E>(url, await transformResponse<D, E>(response, config), config)
}

async function transformResponse<D = unknown, R = unknown>(
  response: Response,
  config?: HttpClientRequestConfig
) {
  return {
    data: await normalizeResponseData(response),
    status: response.status,
    statusText: response.statusText,
    headers: transformResponseHeaders(response),
    config
  } as HttpClientResponse<D, R>
}

function transformResponseHeaders(response: Response) {
  const responseHeaders = {} as HttpClientHeaders

  if (response.headers) {
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })
  }

  return responseHeaders
}

async function normalizeResponseData(response: Response) {
  try {
    return await response.json()
  } catch {
    try {
      return await response.text()
    } catch {
      return null
    }
  }
}

function mergeConfig<D = unknown>(
  config?: HttpClientRequestConfig<D>,
  defaultConfig?: HttpClientRequestConfig
) {
  if (config && defaultConfig) {
    return {
      baseURL: config.baseURL ? config.baseURL : defaultConfig.baseURL || undefined,
      method: config.method ? config.method : defaultConfig.method || 'get',
      headers: {
        ...normalizeHeaders(defaultConfig.headers),
        ...normalizeHeaders(config.headers)
      },
      params: config.params || defaultConfig.params || undefined,
      data: config.data || defaultConfig.data || undefined
    } as HttpClientRequestConfig<D>
  }

  return {}
}

function normalizeHeaders(headers?: HttpClientHeaders): HttpClientHeaders {
  if (headers && Object.keys(headers).length) {
    return Object.keys(headers).reduce((result, key) => {
      result[key.toLowerCase()] = headers[key]
      return result
    }, {} as HttpClientHeaders)
  }

  return {}
}

function buildFullUrl(url: string | null, config?: HttpClientRequestConfig) {
  const baseURL = (config && config.baseURL) || null

  let fullUrl = ''
  if (baseURL) {
    fullUrl += baseURL
  }

  if (url) {
    fullUrl += `/${url}`
  }

  fullUrl = fullUrl.replace(/([^:]\/)\/+/g, '$1')

  const params = generateParams(config)
  if (params) {
    // check if url has any search params
    if (fullUrl.includes('?')) {
      if (fullUrl.endsWith('&')) {
        fullUrl += params
      } else {
        fullUrl = `${fullUrl}&${params}`
      }
    } else {
      fullUrl = `${fullUrl}?${params}`
    }
  }

  return fullUrl
}

function generateParams(config?: HttpClientRequestConfig) {
  if (config && config.params) {
    const urlSearchParams = new URLSearchParams()

    Object.keys(config.params).forEach((key) => {
      const param = config.params && config.params[key]

      if (param !== null && param !== undefined) {
        if (Array.isArray(param)) {
          param.forEach((item) => {
            if (item !== null) urlSearchParams.append(key, item.toString())
          })
        } else {
          urlSearchParams.append(key, param.toString())
        }
      }
    })

    return urlSearchParams.toString()
  }

  return null
}

function generateHeaders(config?: HttpClientRequestConfig) {
  const headers = config && config.headers ? config.headers : {}

  if (!('content-type' in headers)) {
    if (config && config.data) {
      if (!(config.data instanceof FormData)) {
        if (isObject(config.data) || Array.isArray(config.data)) {
          headers['content-type'] = contentTypes.json
        } else {
          headers['content-type'] = contentTypes.text
        }
      }
    } else {
      headers['content-type'] = defaultContentType
    }
  }

  return headers
}

function normalizeBody(config?: HttpClientRequestConfig) {
  if (config && config.data) {
    if (config.data instanceof FormData) return config.data

    if (isObject(config.data) || Array.isArray(config.data)) return JSON.stringify(config.data)

    return config.data
  }

  return undefined
}
