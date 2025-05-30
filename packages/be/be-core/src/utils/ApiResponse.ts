import { Response } from "express";

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  meta?: any;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  statusCode: number;
  requestId?: string;
}

export class ApiResponse {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    message: string = "Success",
    data?: T,
    meta?: any,
  ): Response<ApiSuccessResponse<T>> {
    const response: ApiSuccessResponse<T> = {
      success: true,
      message,
      statusCode: 200,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };

    return res.status(200).json(response);
  }

  /**
   * Send created response
   */
  static created<T>(
    res: Response,
    message: string = "Created successfully",
    data?: T,
  ): Response<ApiSuccessResponse<T>> {
    const response: ApiSuccessResponse<T> = {
      success: true,
      message,
      statusCode: 201,
      ...(data !== undefined && { data }),
    };

    return res.status(201).json(response);
  }

  /**
   * Send no content response
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send bad request error
   */
  static badRequest(
    res: Response,
    message: string = "Bad request",
    errors?: any[],
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 400,
      ...(errors && { errors }),
    };

    return res.status(400).json(response);
  }

  /**
   * Send unauthorized error
   */
  static unauthorized(
    res: Response,
    message: string = "Unauthorized",
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 401,
    };

    return res.status(401).json(response);
  }

  /**
   * Send forbidden error
   */
  static forbidden(
    res: Response,
    message: string = "Forbidden",
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 403,
    };

    return res.status(403).json(response);
  }

  /**
   * Send not found error
   */
  static notFound(
    res: Response,
    message: string = "Not found",
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 404,
    };

    return res.status(404).json(response);
  }

  /**
   * Send conflict error
   */
  static conflict(
    res: Response,
    message: string = "Conflict",
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 409,
    };

    return res.status(409).json(response);
  }

  /**
   * Send internal server error
   */
  static serverError(
    res: Response,
    message: string = "Internal server error",
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode: 500,
    };

    return res.status(500).json(response);
  }

  /**
   * Send custom error response
   */
  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: any[],
  ): Response<ApiErrorResponse> {
    const response: ApiErrorResponse = {
      success: false,
      message,
      statusCode,
      ...(errors && { errors }),
    };

    return res.status(statusCode).json(response);
  }
}
