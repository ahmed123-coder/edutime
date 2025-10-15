import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, PaginatedResponse, HttpStatus } from "@/types/mobile-api";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  pagination?: PaginationMeta;
  rateLimit?: {
    limit: number;
    remaining: number;
    resetTime: string;
  };
}

export class ApiResponseBuilder {
  private static generateRequestId(): string {
    return crypto.randomUUID();
  }

  private static createMeta(meta?: Partial<ResponseMeta>): ResponseMeta {
    return {
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      ...meta,
    };
  }

  /**
   * Create a success response with data
   */
  static success<T>(
    data: T,
    statusCode: HttpStatus = HttpStatus.OK,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse<T>> {
    return NextResponse.json<ApiResponse<T>>(
      {
        success: true,
        data,
        meta: this.createMeta(meta),
      },
      { status: statusCode }
    );
  }

  /**
   * Create a success response with no data
   */
  static successNoContent(
    message?: string,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { message: message || "Operation successful" },
        meta: this.createMeta(meta),
      },
      { status: HttpStatus.OK }
    );
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    meta?: Partial<ResponseMeta>
  ): NextResponse<PaginatedResponse<T>> {
    return NextResponse.json<PaginatedResponse<T>>(
      {
        success: true,
        data,
        meta: this.createMeta({
          ...meta,
          pagination,
        }),
      },
      { status: HttpStatus.OK }
    );
  }

  /**
   * Create an error response
   */
  static error(
    code: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code,
          message,
          details,
        },
        meta: this.createMeta(meta),
      },
      { status: statusCode }
    );
  }

  /**
   * Create a validation error response
   */
  static validationError(
    message: string,
    details?: any,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "VALIDATION_ERROR",
      message,
      HttpStatus.BAD_REQUEST,
      details,
      meta
    );
  }

  /**
   * Create an unauthorized error response
   */
  static unauthorized(
    message: string = "Unauthorized",
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "UNAUTHORIZED",
      message,
      HttpStatus.UNAUTHORIZED,
      undefined,
      meta
    );
  }

  /**
   * Create a forbidden error response
   */
  static forbidden(
    message: string = "Forbidden",
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "FORBIDDEN",
      message,
      HttpStatus.FORBIDDEN,
      undefined,
      meta
    );
  }

  /**
   * Create a not found error response
   */
  static notFound(
    resource: string = "Resource",
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "NOT_FOUND",
      `${resource} not found`,
      HttpStatus.NOT_FOUND,
      undefined,
      meta
    );
  }

  /**
   * Create a conflict error response
   */
  static conflict(
    message: string,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "CONFLICT",
      message,
      HttpStatus.CONFLICT,
      undefined,
      meta
    );
  }

  /**
   * Create a rate limit exceeded response
   */
  static rateLimitExceeded(
    message: string = "Rate limit exceeded",
    resetTime?: Date,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    const response = this.error(
      "RATE_LIMIT_EXCEEDED",
      message,
      HttpStatus.TOO_MANY_REQUESTS,
      undefined,
      meta
    );

    // Add rate limit headers
    if (resetTime) {
      response.headers.set("Retry-After", Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString());
      response.headers.set("X-RateLimit-Reset", resetTime.toISOString());
    }

    return response;
  }

  /**
   * Create an internal server error response
   */
  static internalError(
    message: string = "Internal server error",
    details?: any,
    meta?: Partial<ResponseMeta>
  ): NextResponse<ApiResponse> {
    return this.error(
      "INTERNAL_ERROR",
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
      meta
    );
  }

  /**
   * Calculate pagination metadata
   */
  static createPaginationMeta(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Add CORS headers to response
   */
  static withCors<T>(response: NextResponse<T>): NextResponse<T> {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  /**
   * Add security headers to response
   */
  static withSecurityHeaders<T>(response: NextResponse<T>): NextResponse<T> {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  }

  /**
   * Create a response with all standard headers
   */
  static createStandardResponse<T>(
    response: NextResponse<T>
  ): NextResponse<T> {
    return this.withSecurityHeaders(this.withCors(response));
  }
}

/**
 * Utility functions for common response patterns
 */
export const ResponseUtils = {
  /**
   * Handle successful resource creation
   */
  created<T>(resource: T, location?: string): NextResponse<ApiResponse<T>> {
    const response = ApiResponseBuilder.success(resource, HttpStatus.CREATED);

    if (location) {
      response.headers.set("Location", location);
    }

    return ApiResponseBuilder.createStandardResponse(response);
  },

  /**
   * Handle successful resource update
   */
  updated<T>(resource: T): NextResponse<ApiResponse<T>> {
    return ApiResponseBuilder.createStandardResponse(
      ApiResponseBuilder.success(resource)
    );
  },

  /**
   * Handle successful resource deletion
   */
  deleted(): NextResponse<ApiResponse> {
    return ApiResponseBuilder.createStandardResponse(
      ApiResponseBuilder.successNoContent("Resource deleted successfully")
    );
  },

  /**
   * Handle async operations
   */
  accepted(operationId: string, message?: string): NextResponse<ApiResponse> {
    return ApiResponseBuilder.createStandardResponse(
      ApiResponseBuilder.successNoContent(
        message || "Operation accepted and is being processed",
        { operationId }
      )
    );
  },

  /**
   * Handle file upload responses
   */
  fileUploaded(fileInfo: { url: string; name: string; size: number; type: string }): NextResponse<ApiResponse> {
    return ApiResponseBuilder.createStandardResponse(
      ApiResponseBuilder.success(fileInfo, HttpStatus.CREATED)
    );
  },

  /**
   * Handle batch operations
   */
  batchResult<T>(
    results: Array<{ success: boolean; data?: T; error?: string }>,
    total: number,
    successful: number,
    failed: number
  ): NextResponse<ApiResponse> {
    return ApiResponseBuilder.createStandardResponse(
      ApiResponseBuilder.success({
        results,
        summary: {
          total,
          successful,
          failed,
        },
      })
    );
  },
};