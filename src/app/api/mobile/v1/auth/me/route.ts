import { NextRequest, NextResponse } from "next/server";

import { MobileAuthService } from "@/lib/mobile-auth";
import { RefreshTokenService } from "@/lib/refresh-token";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

export async function GET(request: NextRequest) {
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

    // Get user's active devices
    const devices = await RefreshTokenService.getUserActiveDevices(user.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        devices: devices.map(device => ({
          ...device,
          lastUsed: device.lastUsed.toISOString(),
        })),
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.OK });

  } catch (error: any) {
    console.error("Mobile get profile error:", error);

    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "Internal server error",
      },
    }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}