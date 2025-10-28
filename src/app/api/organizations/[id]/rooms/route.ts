import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/organizations/[id]/rooms
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.room.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}