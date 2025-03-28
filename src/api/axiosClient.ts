import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiError } from "../types";

/**
 * Constants for authentication token storage
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * Creates and configures the Axios instance
 * Uses IIFE pattern to ensure single instance
 */
export const axiosClient: AxiosInstance = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds
  });
})();

// Add custom _retry property to InternalAxiosRequestConfig
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * Request interceptor
 * - Adds authentication token
 * - Handles request configuration
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

interface ErrorResponse {
  message: string;
  code: string;
}

/**
 * Response interceptor
 * - Handles response data transformation
 * - Manages authentication errors
 * - Standardizes error handling
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>): Promise<any> => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const response = await axios.post(
          `${import.meta.env.REACT_APP_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update stored tokens
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Retry original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Transform error response
    const apiError: ApiError = {
      message: error.response?.data?.message || "An unexpected error occurred",
      code: error.response?.data?.code || "UNKNOWN_ERROR",
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

export default axiosClient;
