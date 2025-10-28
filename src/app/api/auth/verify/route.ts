import { NextRequest, NextResponse } from "next/server";

import { sendEmail, generateWelcomeEmailHtml } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 });
    }

    // Find user by email (identifier in verification token)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    const welcomeEmailHtml = generateWelcomeEmailHtml(user.name || "User", user.role);
    await sendEmail({
      to: user.email,
      subject: "Welcome to Formation Space!",
      html: welcomeEmailHtml,
      text: `Welcome to Formation Space! Your account has been verified and is now active.`,
    });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.verified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate verification token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // TODO: Send verification email with token
    console.log(`Verification link: ${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`);

    return NextResponse.json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
