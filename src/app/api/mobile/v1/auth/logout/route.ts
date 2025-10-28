import { NextRequest, NextResponse } from "next/server";

import { MobileJWTService } from "@/lib/mobile-jwt";
import { MobileAuthService } from "@/lib/mobile-auth";
import { RefreshTokenService } from "@/lib/refresh-token";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export async function POST(request: NextRequest) {
  try {
    // Get user from request
    const user = await MobileAuthService.getUserFromRequest(request);

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: "User not authenticated",
        },
      }, { status: HttpStatus.UNAUTHORIZED });
    }

    const authHeader = request.headers.get("authorization");
    const accessToken = MobileJWTService.extractTokenFromHeader(authHeader);

    // Get refresh token from request body (optional)
    let refreshToken: string | undefined;
    try {
      const body = await request.json();
      refreshToken = body.refreshToken;
    } catch {
      // No body or invalid JSON, continue with logout using access token only
    }

    // Revoke refresh token if provided
    if (refreshToken) {
      try {
        const tokenValidation = await RefreshTokenService.validateRefreshToken(refreshToken);
        if (tokenValidation.isValid && tokenValidation.refreshToken?.userId === user.id) {
          await RefreshTokenService.revokeToken(refreshToken);
        }
      } catch (error) {
        console.error("Failed to revoke refresh token during logout:", error);
        // Continue with logout even if refresh token revocation fails
      }
    }

    // Add access token to blacklist if needed
    // Note: Since JWT is stateless, we can't directly blacklist it
    // In production, you might want to implement a token blacklist
    // or have very short access token expiration times

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: "Logged out successfully",
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.OK });

  } catch (error: any) {
    console.error("Mobile logout error:", error);

    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Internal server error",
      },
    }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}