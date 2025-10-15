import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mobileRegisterSchema } from "@/lib/validations/mobile-auth";
import { MobileAuthService } from "@/lib/mobile-auth";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";
import { sendEmail, generateVerificationEmailHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = mobileRegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: ErrorCode.ALREADY_EXISTS,
          message: "User with this email already exists",
        },
      }, { status: HttpStatus.CONFLICT });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        password: hashedPassword,
        role: validatedData.role,
        speciality: validatedData.speciality,
        verified: false, // Email verification required
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        phone: true,
        speciality: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create verification token
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires,
      },
    });

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/mobile/v1/auth/verify-email?token=${verificationToken}`;
    const emailHtml = generateVerificationEmailHtml(verificationUrl, user.name || undefined);

    await sendEmail({
      to: user.email,
      subject: "Verify your EduTime account",
      html: emailHtml,
      text: `Please verify your email by visiting: ${verificationUrl}`,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        message: "User created successfully. Please check your email for verification.",
        requiresVerification: true,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    }, { status: HttpStatus.CREATED });

  } catch (error: any) {
    console.error("Mobile registration error:", error);

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