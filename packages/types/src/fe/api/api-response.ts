// This file defines the structure of API responses used in the application.

// API response structure for successful requests
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Basic API error response structure
export interface ApiError {
  error: string;
  code: number;
  details?: Record<string, unknown>;
}

// Extended API response structure that includes error handling
export interface ApiResponseWithError<T> extends ApiResponse<T> {
  error?: ApiError;
  statusCode?: number; // HTTP status code
  statusText?: string; // HTTP status text
}
