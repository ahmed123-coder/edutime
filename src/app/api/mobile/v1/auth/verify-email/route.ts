import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ApiResponseBuilder, HttpStatus } from "@/lib/api-response";
import { MobileErrorHandler } from "@/lib/mobile-errors";
import { ErrorCode } from "@/types/mobile-api";

export async function GET(request: NextRequest) {
  return MobileErrorHandler.handleRoute(async () => {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return ApiResponseBuilder.validationError(
        "Verification token is required",
        { field: "token", message: "Token parameter is missing" }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return ApiResponseBuilder.notFound("Verification token");
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return ApiResponseBuilder.error(
        ErrorCode.TOKEN_EXPIRED,
        "Verification token has expired",
        HttpStatus.BAD_REQUEST
      );
    }

    // Find user by email (identifier in verification token)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return ApiResponseBuilder.notFound("User");
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Send welcome email
    const { generateWelcomeEmailHtml, sendEmail } = await import("@/lib/email");
    const welcomeEmailHtml = generateWelcomeEmailHtml(user.name || "User", user.role);

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to EduTime!",
        html: welcomeEmailHtml,
        text: `Welcome to EduTime! Your account has been verified and is now active.`,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with success response even if email fails
    }

    return ApiResponseBuilder.success({
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: true,
      },
    });
  });
}