import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createAmenitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
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

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAmenitySchema.parse(body);

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