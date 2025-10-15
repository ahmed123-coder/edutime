import { NextRequest, NextResponse } from "next/server";

import { mobileLoginSchema } from "@/lib/validations/mobile-auth";
import { MobileAuthService } from "@/lib/mobile-auth";
import { RefreshTokenService } from "@/lib/refresh-token";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = mobileLoginSchema.parse(body);

    // Generate device info if not provided
    const deviceInfo = validatedData.deviceInfo ||
                      RefreshTokenService.generateDeviceInfo(request);

    // Authenticate user
    const authResult = await MobileAuthService.authenticateUser(
      validatedData.email,
      validatedData.password,
      validatedData.deviceId
    );

    if (!authResult.success) {
      const statusCode = authResult.error === "Invalid credentials"
        ? HttpStatus.UNAUTHORIZED
        : HttpStatus.BAD_REQUEST;

      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: authResult.needsVerification
            ? ErrorCode.EMAIL_NOT_VERIFIED
            : ErrorCode.INVALID_CREDENTIALS,
          message: authResult.error || "Authentication failed",
        },
      }, { status: statusCode });
    }

    // Store refresh token in database if we have a device ID
    if (validatedData.deviceId && authResult.tokens) {
      try {
        await RefreshTokenService.createRefreshToken({
          userId: authResult.user!.id,
          token: authResult.tokens.refreshToken,
          deviceId: validatedData.deviceId,
          deviceInfo,
        });
      } catch (refreshError) {
        console.error("Failed to store refresh token:", refreshError);
        // Continue with login even if refresh token storage fails
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          ...authResult.user!,
          createdAt: authResult.user!.createdAt.toISOString(),
          updatedAt: authResult.user!.updatedAt.toISOString(),
        },
        tokens: authResult.tokens,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.OK });

  } catch (error: any) {
    console.error("Mobile login error:", error);

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