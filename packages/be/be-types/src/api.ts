// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  statusCode: number;
  requestId?: string;
  errors?: any[];
}

// Success response
export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data?: T;
  meta?: any;
}

// Error response
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  errors?: any[];
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Pagination query parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Filter query parameters
export interface FilterQuery {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// API endpoint definition
export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handler: string;
  middleware?: string[];
  validation?: any;
  auth?: boolean;
  roles?: string[];
}

// Route definition
export interface RouteDefinition {
  prefix?: string;
  endpoints: ApiEndpoint[];
}

// Middleware definition
export interface MiddlewareDefinition {
  name: string;
  path?: string;
  handler: any;
  order?: number;
}
