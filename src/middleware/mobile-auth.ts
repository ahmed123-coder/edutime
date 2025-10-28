import { NextRequest, NextResponse } from "next/server";

import { MobileAuthService } from "@/lib/mobile-auth";
import { MobileJWTService } from "@/lib/mobile-jwt";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export interface MobileAuthMiddlewareOptions {
  required?: boolean;
  roles?: string[];
  skipVerification?: boolean;
}

/**
 * Mobile authentication middleware for API routes
 */
export function withMobileAuth(
  handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>,
  options: MobileAuthMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get("authorization");
      const token = MobileJWTService.extractTokenFromHeader(authHeader);

      if (!token) {
        if (options.required !== false) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: {
              code: ErrorCode.UNAUTHORIZED,
              message: "Authorization header required",
            },
          }, { status: HttpStatus.UNAUTHORIZED });
        }
        // Auth not required, proceed without user context
        return handler(request);
      }

      // Verify token
      const payload = MobileJWTService.verifyAccessToken(token);

      // Get user from database
      const user = await MobileAuthService.getUserFromRequest(request);

      if (!user) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.UNAUTHORIZED,
            message: "User not found",
          },
        }, { status: HttpStatus.UNAUTHORIZED });
      }

      // Check email verification if required
      if (!options.skipVerification && !user.verified) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.EMAIL_NOT_VERIFIED,
            message: "Email verification required",
          },
        }, { status: HttpStatus.FORBIDDEN });
      }

      // Check role requirements
      if (options.roles && options.roles.length > 0) {
        if (!MobileAuthService.hasRole(user.role, options.roles as any[])) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: {
              code: ErrorCode.FORBIDDEN,
              message: "Insufficient permissions",
            },
          }, { status: HttpStatus.FORBIDDEN });
        }
      }

      // Add user to request context
      (request as any).user = user;

      // Call the handler with user context
      return handler(request, { user });

    } catch (error: any) {
      console.error("Mobile auth middleware error:", error);

      if (error.message.includes("expired")) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.TOKEN_EXPIRED,
            message: "Access token expired",
          },
        }, { status: HttpStatus.UNAUTHORIZED });
      }

      if (error.message.includes("Invalid") || error.message.includes("token")) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: {
            code: ErrorCode.INVALID_TOKEN,
            message: "Invalid access token",
          },
        }, { status: HttpStatus.UNAUTHORIZED });
      }

      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Authentication error",
        },
      }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  };
}

/**
 * Helper middleware for admin-only routes
 */
export const withAdminAuth = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: true, roles: ["ADMIN"] });

/**
 * Helper middleware for center owner routes
 */
export const withCenterOwnerAuth = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: true, roles: ["ADMIN", "CENTER_OWNER"] });

/**
 * Helper middleware for teacher routes
 */
export const withTeacherAuth = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: true, roles: ["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER", "TEACHER"] });

/**
 * Helper middleware for partner routes
 */
export const withPartnerAuth = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: true, roles: ["ADMIN", "PARTNER"] });

/**
 * Helper middleware for authenticated users (no role restrictions)
 */
export const withAuthenticatedUser = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: true, skipVerification: false });

/**
 * Helper middleware for optional authentication
 */
export const withOptionalAuth = (handler: (request: NextRequest, context?: { user: any }) => Promise<NextResponse>) =>
  withMobileAuth(handler, { required: false, skipVerification: true });