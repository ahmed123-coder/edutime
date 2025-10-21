import { NextRequest, NextResponse } from "next/server";

import { resetPasswordSchema } from "@/lib/validations/mobile-auth";
import { prisma } from "@/lib/prisma";
import { ApiResponseBuilder, HttpStatus } from "@/lib/api-response";
import { MobileErrorHandler } from "@/lib/mobile-errors";
import { ErrorCode } from "@/types/mobile-api";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  return MobileErrorHandler.handleRoute(async () => {
    const body = await request.json();

    // Validate input
    const validatedData = resetPasswordSchema.parse(body);

    // Find reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token: validatedData.token },
    });

    if (!resetToken) {
      return ApiResponseBuilder.notFound("Reset token");
    }

    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token: validatedData.token },
      });

      return ApiResponseBuilder.error(
        ErrorCode.TOKEN_EXPIRED,
        "Reset token has expired",
        HttpStatus.BAD_REQUEST
      );
    }

    // Find user by email (identifier in reset token)
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
    });

    if (!user) {
      return ApiResponseBuilder.notFound("User");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete reset token
    await prisma.verificationToken.delete({
      where: { token: validatedData.token },
    });

    // Revoke all refresh tokens for this user (force re-login on all devices)
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    // Send confirmation email
    const { generatePasswordResetConfirmationEmailHtml, sendEmail } = await import("@/lib/email");
    const emailHtml = generatePasswordResetConfirmationEmailHtml(user.name || undefined);

    try {
      await sendEmail({
        to: user.email,
        subject: "Your EduTime password has been reset",
        html: emailHtml,
        text: "Your password has been successfully reset. You can now login with your new password.",
      });
    } catch (emailError) {
      console.error("Failed to send password reset confirmation email:", emailError);
      // Continue with success response even if email fails
    }

    return ApiResponseBuilder.success({
      message: "Password reset successfully. Please login with your new password.",
    });
  });
}