import type { FetcherOptions, FetchPath, FetchResponse } from "./types";
import { generateURL, mergeOptions } from "./helpers";
import { useUserStore } from "@/stores/user";
import { useSnackbar } from "@/stores/snackbar";

// Global state for token refresh management
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
const failedQueue: Array<{
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
}> = [];

const useFetch = async <R = unknown, D = unknown>(
  path: FetchPath,
  options?: FetcherOptions
): Promise<FetchResponse<R>> => {
  const url = generateURL(path, {
    baseURL: options?.baseURL,
    parameters: options?.parameters,
  });
  const mergedOptions = mergeOptions(options);

  try {
    const response = await fetch(url, mergedOptions);

    if (response.status === 204) {
      console.log("No content returned (204 status)");
      return {
        status: response.status,
        statusText: response.statusText,
        data: null as unknown as R,
        headers: response.headers,
      };
    }

    const responseClone = response.clone();
    responseClone.json().catch((err) => {
      console.log("Failed to parse response:", err);
    });

    return statusChecker<R>(response, url.toString(), mergedOptions);
  } catch (e) {
    throw new Error(e as string);
  }
};

const formattedResponse = async <R>(
  response: Response
): Promise<FetchResponse<R>> => ({
  data: (await normalizeResponseData(response)) as R,
  status: response.status,
  statusText: response.statusText,
  headers: response.headers,
});

const statusChecker = async <R>(
  response: Response,
  originalUrl: string,
  originalOptions: RequestInit
): Promise<FetchResponse<R>> => {
  const responseForLogging = response.clone();
  const headers: { [key: string]: string } = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const responseBody = await responseForLogging.json();

  if (response.ok) {
    return Promise.resolve(await formattedResponse<R>(response));
  }

  const snackbar = useSnackbar();
  if (response.status === 400) {
    console.log(responseBody);
    snackbar.show(responseBody[0]);
  }

  if (response.status === 401) {
    console.warn(
      `401 Unauthorized at ${response.url}. Attempting to refresh token.`
    );
    
    // Handle token refresh with queue
    const refreshed = await handleTokenRefresh();
    
    if (refreshed) {
      // Update the Authorization header with the new token
      const { user } = useUserStore();
      const updatedOptions = {
        ...originalOptions,
        headers: {
          ...originalOptions.headers,
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const retriedResponse = await fetch(originalUrl, updatedOptions);
      if (retriedResponse.ok) {
        return Promise.resolve(await formattedResponse<R>(retriedResponse));
      }
    }
  }

  console.error(`Error Response: ${response.status} ${response.statusText}`);
  throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
};

const handleTokenRefresh = async (): Promise<boolean> => {
  // If already refreshing, wait for the current refresh to complete
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  // If there's already a refresh promise, return it
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start the refresh process
  isRefreshing = true;
  refreshPromise = refreshAccessToken();

  try {
    const result = await refreshPromise;
    
    // Process the failed queue
    if (result) {
      // Success: resolve all waiting requests
      failedQueue.forEach(({ resolve }) => resolve(true));
    } else {
      // Failure: reject all waiting requests
      failedQueue.forEach(({ reject }) => reject(new Error('Token refresh failed')));
    }
    
    // Clear the queue
    failedQueue.length = 0;
    
    return result;
  } finally {
    // Reset the refresh state
    isRefreshing = false;
    refreshPromise = null;
  }
};

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshUrl = "https://api.carshenas.shop/user/refresh/";
    const { user, wipeUserData, updateStoredData } = useUserStore();
    const refreshToken = user.refreshToken;
    
    if (!refreshToken) {
      console.error("No refresh token available in user store.");
      return false;
    }
    
    const refreshOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    };
    
    const response = await fetch(refreshUrl, refreshOptions);
    
    if (response.ok) {
      const { access, refresh } = await response.json();
      
      // Update tokens atomically
      user.token = access;
      user.refreshToken = refresh;
      updateStoredData();
      
      console.log("Token refreshed successfully");
      return true;
    } else {
      console.error(
        `Failed to refresh token: ${response.status} ${response.statusText}`
      );
      
      // Only wipe user data if it's a client error (4xx)
      if (response.status >= 400 && response.status < 500) {
        wipeUserData();
      }
      
      return false;
    }
  } catch (error) {
    console.error("Error while refreshing token:", error);
    return false;
  }
};

const normalizeResponseData = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
};

export default useFetch;
