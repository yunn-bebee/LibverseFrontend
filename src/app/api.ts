/* eslint-disable no-useless-catch */
import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from "axios";

// Api instance configuration
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

// Request interceptor for auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//  Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
    throw error.response?.data ?? error.message;
  }
);

// Core request function
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// 5. Pre-configured methods
export const apiClient = {
  get: <T>(url: string) => request<T>({ method: "GET", url }),
  
  post: <T>(url: string, data: unknown) => 
    request<T>({ method: "POST", url, data }),

  put: <T>(url: string, data: unknown) => 
    request<T>({ method: "PUT", url, data }),

  patch: <T>(url: string, data: unknown) => 
    request<T>({ method: "PATCH", url, data }),

  delete: <T>(url: string) => 
    request<T>({ method: "DELETE", url }),

  upload: <T>(url: string, formData: FormData) => 
    request<T>({
      method: "POST",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }),

  download: <T>(url: string) => 
    request<T>({ method: "GET", url, responseType: "blob" })
};

// 6. Error type (optional)
export type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
};