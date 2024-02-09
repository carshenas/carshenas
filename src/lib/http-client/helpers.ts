const objectToString = Object.prototype.toString
const isError = (value: unknown) =>
  objectToString.call(value) === '[object Error]'
const errorMessages = new Set([
  'Failed to fetch', // Chrome
  'NetworkError when attempting to fetch resource.', // Firefox
  'The Internet connection appears to be offline.', // Safari 16
  'Load failed', // Safari 17+
  'Network request failed', // `cross-fetch`
  'fetch failed' // Undici (Node.js)
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNetworkError(error: any) {
  const isValid =
    error &&
    isError(error) &&
    error.name &&
    error.name === 'TypeError' &&
    typeof error.message === 'string'

  if (!isValid) {
    return false
  }

  // We do an extra check for Safari 17+ as it has a very generic error message.
  // Network errors in Safari have no stack.
  if (error.message === 'Load failed') {
    return error.stack === undefined
  }

  return errorMessages.has(error.message)
}

export function isObject(value: unknown) {
  const type = typeof value

  return value !== null && (type === 'object' || type === 'function')
}
