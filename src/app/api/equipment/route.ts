import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const equipmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
});

const updateEquipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().optional(),
});

// GET /api/equipment
export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ equipment });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/equipment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // permetion for admin owner center 
    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = equipmentSchema.parse(body);

    const equipment = await prisma.equipment.create({
      data: validatedData
    });

    return NextResponse.json({ equipment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error creating equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/equipment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // permetion for admin owner center 
    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = updateEquipmentSchema.parse(body);

    const equipment = await prisma.equipment.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ equipment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error updating equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/equipment
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

        // permetion for admin owner center 
    if (!session?.user || session.user.role !== "ADMIN" && session.user.role !== "CENTER_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.equipment.update({
      where: { id },
      data: { active: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}