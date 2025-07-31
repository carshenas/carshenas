// carshenasService.ts
import { camelize, decamelize } from "@/helpers/general";
import fetcher from "@/lib/fetcher";
import type { FetcherOptions } from "@/lib/fetcher/types";
import { useUserStore } from "@/stores/user";
import type { DecamelizeObjectKeys } from "@/types/utilities";
import isObject from "lodash/isObject";
import snakeCase from "lodash/snakeCase";

// Determine if HTTPS should be used based on environment variable
const isHttps = import.meta.env.VITE_SSL_ENABLED === "true";
const scheme = isHttps ? "https" : "http";
// Construct the base API URL using the determined scheme and server address
const baseURL = `${scheme}://${import.meta.env.VITE_API_SERVER}`;

// Create a global headers object that will be shared across all requests
const headers = new Headers();

// Default configuration options for all API calls
const carshenasFetchOptions = {
  baseURL,
  withCredentials: true, // Include cookies in requests for authentication
};

/**
 * Transforms parameter objects from camelCase to snake_case for API compatibility
 * Handles both object parameters and string parameters
 */
const handleParameters = (parameters?: FetcherOptions["parameters"]) =>
  parameters
    ? isObject(parameters)
      ? (decamelize(parameters) as URLSearchParams) // Convert object keys to snake_case
      : (snakeCase(parameters) as unknown as URLSearchParams) // Convert string to snake_case
    : undefined;

/**
 * Transforms request body from camelCase to snake_case for API compatibility
 * Preserves FormData objects as-is since they don't need key transformation
 */
const handleBody = (body?: FetcherOptions["body"]) =>
  body && !(body instanceof FormData) ? decamelize(body) : body;

/**
 * Transforms API response from snake_case back to camelCase for frontend use
 * This ensures consistent naming conventions throughout the application
 */
const handleResponse = <R>(response: { data: DecamelizeObjectKeys<R> }) => ({
  ...response,
  data: camelize(response.data) as R,
});

/**
 * Adds Authorization bearer token to headers if user is authenticated
 * Uses the user store to get the current user's token
 */
const addAuthorizationHeader = () => {
  const { user } = useUserStore();
  if (user.token && !headers.has("Authorization")) {
    headers.append("Authorization", `Bearer ${user.token}`);
  }
};

/**
 * Merges custom headers with the global headers object
 * Custom headers will override global headers if there are conflicts
 */
const mergeHeaders = (customHeaders?: HeadersInit) => {
  const mergedHeaders = new Headers(headers);
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      mergedHeaders.set(key, value);
    });
  }
  return mergedHeaders;
};

// Main service object that provides HTTP methods with consistent preprocessing
const carshenasService = {
  /**
   * HTTP GET request with automatic parameter transformation and authentication
   */
  get: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader(); // Ensure user is authenticated
    const parameters = handleParameters(options?.parameters); // Transform params to snake_case
    const result = await fetcher.get<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      headers: mergeHeaders(options?.headers), // Merge custom headers
      ...carshenasFetchOptions, // Apply default config
    });

    return handleResponse(result); // Transform response back to camelCase
  },

  /**
   * HTTP POST request with body and parameter transformation
   */
  post: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const body = handleBody(options?.body); // Transform body to snake_case
    const result = await fetcher.post<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      body,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },

  /**
   * HTTP PUT request for full resource updates
   */
  put: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const body = handleBody(options?.body);
    const result = await fetcher.put<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      body,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },

  /**
   * HTTP PATCH request for partial resource updates
   */
  patch: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const body = handleBody(options?.body);
    const result = await fetcher.patch<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      body,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },

  /**
   * HTTP DELETE request for resource removal
   */
  delete: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const result = await fetcher.delete<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },
};

export default carshenasService;
