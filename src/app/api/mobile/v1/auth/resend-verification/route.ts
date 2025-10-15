import { NextRequest, NextResponse } from "next/server";

import { resendVerificationSchema } from "@/lib/validations/mobile-auth";
import { prisma } from "@/lib/prisma";
import { withPasswordResetRateLimit } from "@/lib/rate-limiting";
import { ApiResponseBuilder, HttpStatus } from "@/lib/api-response";
import { MobileErrorHandler } from "@/lib/mobile-errors";
import { ErrorCode } from "@/types/mobile-api";

export const POST = withPasswordResetRateLimit(
  MobileErrorHandler.withErrorHandler(async (request: NextRequest) => {
    const body = await request.json();

    // Validate input
    const validatedData = resendVerificationSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return ApiResponseBuilder.success({
        message: "If the email exists in our system, a verification email has been sent.",
      });
    }

    if (user.verified) {
      return ApiResponseBuilder.error(
        ErrorCode.CONFLICT,
        "Email is already verified",
        HttpStatus.CONFLICT
      );
    }

    // Generate new verification token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Send verification email
    const { generateVerificationEmailHtml, sendEmail } = await import("@/lib/email");
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/mobile/v1/auth/verify-email?token=${token}`;
    const emailHtml = generateVerificationEmailHtml(verificationUrl, user.name || undefined);

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your EduTime account",
        html: emailHtml,
        text: `Please verify your email by visiting: ${verificationUrl}`,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with success response for security
    }

    return ApiResponseBuilder.success({
      message: "Verification email sent. Please check your inbox.",
    });
  })
);