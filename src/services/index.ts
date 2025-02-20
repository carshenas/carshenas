// carshenasService.ts
import { camelize, decamelize } from "@/helpers/general";
import fetcher from "@/lib/fetcher";
import type { FetcherOptions } from "@/lib/fetcher/types";
import { useUserStore } from "@/stores/user";
import type { DecamelizeObjectKeys } from "@/types/utilities";
import isObject from "lodash/isObject";
import snakeCase from "lodash/snakeCase";

const isHttps = import.meta.env.VITE_SSL_ENABLED === "true";
const scheme = isHttps ? "https" : "http";
const baseURL = `${scheme}://${import.meta.env.VITE_API_SERVER}`;

const headers = new Headers();

const carshenasFetchOptions = {
  baseURL,
  withCredentials: true,
};

const handleParameters = (parameters?: FetcherOptions["parameters"]) =>
  parameters
    ? isObject(parameters)
      ? (decamelize(parameters) as URLSearchParams)
      : (snakeCase(parameters) as unknown as URLSearchParams)
    : undefined;

const handleBody = (body?: FetcherOptions["body"]) =>
  body && !(body instanceof FormData) ? decamelize(body) : body;

const handleResponse = <R>(response: { data: DecamelizeObjectKeys<R> }) => ({
  ...response,
  data: camelize(response.data) as R,
});

const addAuthorizationHeader = () => {
  const { user } = useUserStore();
  if (user.token && !headers.has("Authorization")) {
    headers.append("Authorization", `Bearer ${user.token}`);
  }
};

const mergeHeaders = (customHeaders?: HeadersInit) => {
  const mergedHeaders = new Headers(headers);
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      mergedHeaders.set(key, value);
    });
  }
  return mergedHeaders;
};

const carshenasService = {
  get: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const result = await fetcher.get<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },
  post: async <R>(url: string, options?: FetcherOptions) => {
    addAuthorizationHeader();
    const parameters = handleParameters(options?.parameters);
    const body = handleBody(options?.body);
    const result = await fetcher.post<DecamelizeObjectKeys<R>>(url, {
      ...options,
      parameters,
      body,
      headers: mergeHeaders(options?.headers),
      ...carshenasFetchOptions,
    });

    return handleResponse(result);
  },
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
