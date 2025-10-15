import { NextRequest, NextResponse } from "next/server";

import { OAuth2Client } from "google-auth-library";
import { mobileGoogleSchema } from "@/lib/validations/mobile-auth";
import { MobileAuthService } from "@/lib/mobile-auth";
import { RefreshTokenService } from "@/lib/refresh-token";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = mobileGoogleSchema.parse(body);

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: validatedData.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INVALID_TOKEN,
          message: "Invalid Google token",
        },
      }, { status: HttpStatus.UNAUTHORIZED });
    }

    // Verify access token (optional but recommended)
    try {
      await googleClient.getTokenInfo(validatedData.accessToken);
    } catch (error) {
      console.error("Google access token verification failed:", error);
      // Continue anyway as ID token is more important
    }

    // Generate device info if not provided
    const deviceInfo = validatedData.deviceInfo ||
                      RefreshTokenService.generateDeviceInfo(request);

    // Authenticate with Google
    const authResult = await MobileAuthService.authenticateGoogleUser(
      payload.email,
      payload.name || "Google User",
      payload.sub, // Google's unique user ID
      validatedData.deviceId
    );

    if (!authResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: authResult.error || "Google authentication failed",
        },
      }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
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
        // Continue with authentication even if refresh token storage fails
      }
    }

    // Check if this is a new user
    const isNewUser = payload.email !== authResult.user?.email; // This logic may need adjustment

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          ...authResult.user!,
          createdAt: authResult.user!.createdAt.toISOString(),
          updatedAt: authResult.user!.updatedAt.toISOString(),
        },
        tokens: authResult.tokens,
        isNewUser,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.OK });

  } catch (error: any) {
    console.error("Mobile Google auth error:", error);

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

    // Handle Google OAuth specific errors
    if (error.message?.includes("invalid_token") || error.message?.includes("invalid_grant")) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.INVALID_TOKEN,
          message: "Invalid Google token",
        },
      }, { status: HttpStatus.UNAUTHORIZED });
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