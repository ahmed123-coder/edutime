import { NextRequest, NextResponse } from "next/server";

import { refreshTokenSchema } from "@/lib/validations/mobile-auth";
import { MobileAuthService } from "@/lib/mobile-auth";
import { RefreshTokenService } from "@/lib/refresh-token";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = refreshTokenSchema.parse(body);

    // Validate refresh token
    const tokenValidation = await RefreshTokenService.validateRefreshToken(
      validatedData.refreshToken
    );

    if (!tokenValidation.isValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INVALID_TOKEN,
          message: tokenValidation.error || "Invalid refresh token",
        },
      }, { status: HttpStatus.UNAUTHORIZED });
    }

    // Refresh tokens
    const refreshResult = await MobileAuthService.refreshTokens(
      validatedData.refreshToken
    );

    if (!refreshResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INVALID_TOKEN,
          message: refreshResult.error || "Token refresh failed",
        },
      }, { status: HttpStatus.UNAUTHORIZED });
    }

    // Get the existing refresh token record to get device info
    const existingRefreshToken = tokenValidation.refreshToken!;

    // Create new refresh token record
    if (existingRefreshToken.deviceId && refreshResult.tokens) {
      try {
        await RefreshTokenService.createRefreshToken({
          userId: refreshResult.user!.id,
          token: refreshResult.tokens.refreshToken,
          deviceId: existingRefreshToken.deviceId,
          deviceInfo: existingRefreshToken.deviceInfo || undefined,
        });

        // Revoke the old refresh token
        await RefreshTokenService.revokeToken(validatedData.refreshToken);
      } catch (refreshError) {
        console.error("Failed to create new refresh token record:", refreshError);
        // Continue with refresh even if database operations fail
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          ...refreshResult.user!,
          createdAt: refreshResult.user!.createdAt.toISOString(),
          updatedAt: refreshResult.user!.updatedAt.toISOString(),
        },
        tokens: refreshResult.tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.OK });

  } catch (error: any) {
    console.error("Mobile token refresh error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Invalid input data",
          details: error.errors,
        },
      }, { status: HttpStatus.BAD_REQUEST });
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Internal server error",
      },
    }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}