import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Validation schema for creating availability blocks
const createAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  reason: z.string().min(1, "Reason is required for blocked availability"),
});

// Validation schema for GET parameters
const getAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
});

// Helper function to check if user has permission to manage room availability
async function canManageAvailability(userRole: string, userId: string, roomId: string): Promise<boolean> {
  // Admins can manage all room availability
  if (userRole === "ADMIN") {
    return true;
  }

  // Check if user is OWNER or MANAGER of the organization that owns the room
  if (["CENTER_OWNER", "TRAINING_MANAGER"].includes(userRole)) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { organizationId: true },
    });

    if (!room) {
      return false;
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId: room.organizationId,
        role: { in: ["OWNER", "MANAGER"] },
      },
    });

    return !!membership;
  }

  return false;
}

// Helper function to check for conflicts with existing bookings
async function checkBookingConflicts(roomId: string, date: Date, startTime: Date, endTime: Date): Promise<boolean> {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      date,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      OR: [
        // New availability starts during existing booking
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } }
          ],
        },
        // New availability ends during existing booking
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } }
          ],
        },
        // New availability completely contains existing booking
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } }
          ],
        },
      ],
    },
  });

  return !!conflictingBooking;
}

// POST /api/availability - Create a new blocked availability period
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json();
    const validatedData = createAvailabilitySchema.parse(body);

    // 3. Verify room exists
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      select: { id: true, name: true, organizationId: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // 4. Check user permissions
    const hasPermission = await canManageAvailability(session.user.role, session.user.id, validatedData.roomId);
    if (!hasPermission) {
      return NextResponse.json({
        error: "Forbidden: You don't have permission to manage this room's availability"
      }, { status: 403 });
    }

    // 5. Convert time strings to Date objects for conflict checking
    const date = new Date(validatedData.date);
    const startTimeDate = new Date(`1970-01-01T${validatedData.startTime}:00.000Z`);
    const endTimeDate = new Date(`1970-01-01T${validatedData.endTime}:00.000Z`);

    // Validate time range makes sense
    if (startTimeDate >= endTimeDate) {
      return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });
    }

    // 6. Check for conflicts with existing bookings
    const hasConflicts = await checkBookingConflicts(validatedData.roomId, date, startTimeDate, endTimeDate);
    if (hasConflicts) {
      return NextResponse.json({
        error: "Cannot create availability block: conflicts with existing bookings"
      }, { status: 409 });
    }

    // 7. Create the availability block
    const availability = await prisma.roomAvailability.create({
      data: {
        roomId: validatedData.roomId,
        date,
        startTime: startTimeDate,
        endTime: endTimeDate,
        type: "BLOCKED",
        reason: validatedData.reason,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      availability,
      message: "Room availability block created successfully"
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Validation error",
        details: error.errors
      }, { status: 400 });
    }

    console.error("Error creating availability block:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/availability - Get availability records for a room and date range
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryData = {
      roomId: searchParams.get("roomId") || "",
      start: searchParams.get("start") || "",
      end: searchParams.get("end") || "",
    };

    const validatedQuery = getAvailabilitySchema.parse(queryData);

    // 3. Check user permissions
    const hasPermission = await canManageAvailability(session.user.role, session.user.id, validatedQuery.roomId);
    if (!hasPermission) {
      return NextResponse.json({
        error: "Forbidden: You don't have permission to view this room's availability"
      }, { status: 403 });
    }

    // 4. Fetch availability records
    const startDate = new Date(validatedQuery.start);
    const endDate = new Date(validatedQuery.end);

    const availabilityRecords = await prisma.roomAvailability.findMany({
      where: {
        roomId: validatedQuery.roomId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json({
      availability: availabilityRecords,
      count: availabilityRecords.length,
      roomId: validatedQuery.roomId,
      dateRange: {
        start: validatedQuery.start,
        end: validatedQuery.end,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Validation error",
        details: error.errors
      }, { status: 400 });
    }

    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}