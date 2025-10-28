import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export class MobileApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: HttpStatus;
  public readonly details?: any;

  constructor(code: ErrorCode, message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, details?: any) {
    super(message);
    this.name = "MobileApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends MobileApiError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends MobileApiError {
  constructor(message: string = "Authentication failed") {
    super(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends MobileApiError {
  constructor(message: string = "Insufficient permissions") {
    super(ErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends MobileApiError {
  constructor(resource: string = "Resource") {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, HttpStatus.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends MobileApiError {
  constructor(message: string) {
    super(ErrorCode.CONFLICT, message, HttpStatus.CONFLICT);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends MobileApiError {
  constructor(message: string = "Rate limit exceeded") {
    super(ErrorCode.RATE_LIMIT_EXCEEDED, message, HttpStatus.TOO_MANY_REQUESTS);
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends MobileApiError {
  constructor(message: string = "Internal server error") {
    super(ErrorCode.INTERNAL_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = "InternalServerError";
  }
}

/**
 * Error handling utility for mobile API
 */
export class MobileErrorHandler {
  /**
   * Handle different types of errors and return appropriate API responses
   */
  static handle(error: unknown, request?: NextRequest): NextResponse<ApiResponse> {
    console.error("Mobile API Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url: request?.url,
      method: request?.method,
      userAgent: request?.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    });

    // Mobile API custom errors
    if (error instanceof MobileApiError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      }, { status: error.statusCode });
    }

    // Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid input data",
          details: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      }, { status: HttpStatus.BAD_REQUEST });
    }

    // Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as any;

      switch (prismaError.code) {
        case "P2002":
          // Unique constraint violation
          return NextResponse.json<ApiResponse>({
            success: false,
            error: {
              code: ErrorCode.CONFLICT,
              message: "Resource already exists",
              details: {
                field: prismaError.meta?.target,
              },
            },
            meta: {
              timestamp: new Date().toISOString(),
              requestId: crypto.randomUUID(),
            },
          }, { status: HttpStatus.CONFLICT });

        case "P2025":
          // Record not found
          return NextResponse.json<ApiResponse>({
            success: false,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: "Resource not found",
            },
            meta: {
              timestamp: new Date().toISOString(),
              requestId: crypto.randomUUID(),
            },
          }, { status: HttpStatus.NOT_FOUND });

        case "P2003":
          // Foreign key constraint violation
          return NextResponse.json<ApiResponse>({
            success: false,
            error: {
              code: ErrorCode.VALIDATION_ERROR,
              message: "Referenced resource does not exist",
            },
            meta: {
              timestamp: new Date().toISOString(),
              requestId: crypto.randomUUID(),
            },
          }, { status: HttpStatus.BAD_REQUEST });
      }
    }

    // JWT errors
    if (error instanceof Error) {
      if (error.message.includes("TokenExpiredError")) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.TOKEN_EXPIRED,
            message: "Access token expired",
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        }, { status: HttpStatus.UNAUTHORIZED });
      }

      if (error.message.includes("JsonWebTokenError") || error.message.includes("invalid token")) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.INVALID_TOKEN,
            message: "Invalid access token",
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        }, { status: HttpStatus.UNAUTHORIZED });
      }
    }

    // Generic error
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "An unexpected error occurred",
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }

  /**
   * Create standardized success response
   */
  static success<T>(data: T, meta?: any): NextResponse<ApiResponse<T>> {
    return NextResponse.json<ApiResponse<T>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        ...meta,
      },
    });
  }

  /**
   * Create standardized error response
   */
  static error(
    code: ErrorCode,
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any
  ): NextResponse<ApiResponse> {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: statusCode });
  }

  /**
   * Handle async route handlers with error catching
   */
  static async handleRoute(
    handler: () => Promise<NextResponse<ApiResponse>>
  ): Promise<NextResponse<ApiResponse>> {
    try {
      return await handler();
    } catch (error) {
      return this.handle(error);
    }
  }
}

/**
 * Decorator for async route handlers with automatic error handling
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse<ApiResponse>>
) {
  return async (request: NextRequest): Promise<NextResponse<ApiResponse>> => {
    return MobileErrorHandler.handleRoute(() => handler(request));
  };
}