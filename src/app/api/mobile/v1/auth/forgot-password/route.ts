import { NextRequest, NextResponse } from "next/server";

import { forgotPasswordSchema } from "@/lib/validations/mobile-auth";
import { prisma } from "@/lib/prisma";
import { withPasswordResetRateLimit } from "@/lib/rate-limiting";
import { ApiResponseBuilder, HttpStatus } from "@/lib/api-response";
import { withErrorHandler } from "@/lib/mobile-errors";
import { ErrorCode } from "@/types/mobile-api";

export const POST = withPasswordResetRateLimit(
  withErrorHandler(async (request: NextRequest) => {
    const body = await request.json();

    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return ApiResponseBuilder.success({
        message: "If the email exists in our system, a password reset link has been sent.",
      });
    }

    // Generate password reset token
    const resetToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Store reset token (using verificationToken table)
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: resetToken,
        expires,
      },
    });

    // Send password reset email
    const { generatePasswordResetEmailHtml, sendEmail } = await import("@/lib/email");
    const resetUrl = `${process.env.NEXTAUTH_URL}/api/mobile/v1/auth/reset-password?token=${resetToken}`;
    const emailHtml = generatePasswordResetEmailHtml(resetUrl, user.name || undefined);

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your EduTime password",
        html: emailHtml,
        text: `Please reset your password by visiting: ${resetUrl}`,
      });
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Continue with success response for security
    }

    return ApiResponseBuilder.success({
      message: "Password reset link sent. Please check your email.",
    });
  })
);