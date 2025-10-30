import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const amenitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
});

const updateAmenitySchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().optional(),
});

// GET /api/amenities
export async function GET() {
  try {
    const amenities = await prisma.amenity.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ amenities });
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/amenities
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = amenitySchema.parse(body);

    const amenity = await prisma.amenity.create({
      data: validatedData
    });

    return NextResponse.json({ amenity }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error creating amenity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/amenities
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = updateAmenitySchema.parse(body);

    const amenity = await prisma.amenity.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ amenity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error updating amenity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/amenities
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.amenity.update({
      where: { id },
      data: { active: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}