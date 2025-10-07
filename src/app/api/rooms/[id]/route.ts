import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Validation schema for updates
const updateRoomSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  capacity: z.number().int().min(1).optional(),
  area: z.number().positive().optional(),
  hourlyRate: z.number().positive().optional(),
  equipment: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
  active: z.boolean().optional(),
});

// Helper function to check permissions
async function canAccessRoom(userRole: string, userId: string, roomId: string) {
  if (userRole === "ADMIN") {
    return true; // Admins can access all rooms
  }

  // Get room with organization info
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { organizationId: true },
  });

  if (!room) {
    return false;
  }

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId: room.organizationId,
    },
  });

  return !!membership;
}

// GET /api/rooms/[id] - Get specific room
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Check permissions
    if (!(await canAccessRoom(session.user.role, session.user.id, roomId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        capacity: true,
        area: true,
        hourlyRate: true,
        equipment: true,
        amenities: true,
        photos: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            address: true,
            phone: true,
            email: true,
          },
        },
        bookings: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: "asc",
          },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/rooms/[id] - Update room
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Check permissions
    if (!(await canAccessRoom(session.user.role, session.user.id, roomId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateRoomSchema.parse(body);

    // Update room
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: validatedData,
      select: {
        id: true,
        organizationId: true,
        name: true,
        description: true,
        capacity: true,
        area: true,
        hourlyRate: true,
        equipment: true,
        amenities: true,
        photos: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error updating room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/rooms/[id] - Delete room
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Only admins can delete rooms
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only admins can delete rooms" }, { status: 403 });
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true, name: true },
    });

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if room has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        roomId,
        startTime: {
          gte: new Date(),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete room with active bookings. Please cancel or complete all bookings first.",
        },
        { status: 400 },
      );
    }

    // Delete room (this will cascade delete related records)
    await prisma.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
