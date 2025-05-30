import { HttpStatusCodes } from '@/utils/httpStatusCodes';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
  errors?: ApiError[];
  statusCode: HttpStatusCodes;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}
