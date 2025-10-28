import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  role: z.enum(["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER", "TEACHER", "PARTNER"]).optional(),
  speciality: z.string().max(100).optional().or(z.literal("")),
  verified: z.boolean().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

// GET /api/users/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        verified: true,
        avatar: true,
        speciality: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Center owners can only edit teachers and partners
    if (
      (session.user.role === "CENTER_OWNER" || session.user.role === "TRAINING_MANAGER") &&
      !["TEACHER", "PARTNER"].includes(existingUser.role)
    ) {
      return NextResponse.json({ error: "Forbidden: Can only edit teachers and partners" }, { status: 403 });
    }

    // Clean up empty optional fields
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || null;
    if (validatedData.role !== undefined) updateData.role = validatedData.role;
    if (validatedData.speciality !== undefined) updateData.speciality = validatedData.speciality || null;
    if (validatedData.verified !== undefined) updateData.verified = validatedData.verified;
    if (validatedData.avatar !== undefined) updateData.avatar = validatedData.avatar || null;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        verified: true,
        avatar: true,
        speciality: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (existingUser.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // Center owners can only delete teachers and partners
    if (
      (session.user.role === "CENTER_OWNER" || session.user.role === "TRAINING_MANAGER") &&
      !["TEACHER", "PARTNER"].includes(existingUser.role)
    ) {
      return NextResponse.json({ error: "Forbidden: Can only delete teachers and partners" }, { status: 403 });
    }

    // Hard delete for now (until migration is run)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
