import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations";
import { sendEmail, generateVerificationEmailHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = validatedData.password ? await bcrypt.hash(validatedData.password, 12) : undefined;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        password: hashedPassword,
        role: validatedData.role || UserRole.TEACHER,
        speciality: validatedData.speciality,
        verified: false, // Email verification required
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true,
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
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    const emailHtml = generateVerificationEmailHtml(verificationUrl, user.name || undefined);

    await sendEmail({
      to: user.email,
      subject: "Verify your Formation Space account",
      html: emailHtml,
      text: `Please verify your email by visiting: ${verificationUrl}`,
    });

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email for verification.",
        user,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
