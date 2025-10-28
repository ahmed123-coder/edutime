import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Validation schema for updates
const updateBookingSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format")
    .optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  paymentMethod: z.enum(["KONNECT", "CLICKTOPAY", "ON_SITE", "BANK_TRANSFER"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL_REFUND"]).optional(),
  notes: z.string().optional(),
  cancelReason: z.string().optional(),
});

// Helper function to check permissions
async function canAccessBooking(userRole: string, userId: string, bookingId: string) {
  if (userRole === "ADMIN") {
    return true; // Admins can access all bookings
  }

  // Get booking with organization info
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      userId: true,
      organizationId: true,
    },
  });

  if (!booking) {
    return false;
  }

  // Teachers can access their own bookings
  if (booking.userId === userId) {
    return true;
  }

  // Center owners can access bookings in their organizations
  if (["CENTER_OWNER", "TRAINING_MANAGER"].includes(userRole)) {
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId: booking.organizationId,
      },
    });
    return !!membership;
  }

  return false;
}

// Helper function to calculate booking amount
function calculateBookingAmount(hourlyRate: number, startTime: string, endTime: string) {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const totalAmount = hourlyRate * durationHours;
  const commission = totalAmount * 0.1; // 10% commission
  return { totalAmount, commission };
}

// GET /api/bookings/[id] - Get specific booking
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Check permissions
    if (!(await canAccessBooking(session.user.role, session.user.id, bookingId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        organizationId: true,
        roomId: true,
        userId: true,
        date: true,
        startTime: true,
        endTime: true,
        totalAmount: true,
        commission: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        notes: true,
        cancelReason: true,
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
        room: {
          select: {
            id: true,
            name: true,
            description: true,
            capacity: true,
            area: true,
            hourlyRate: true,
            equipment: true,
            amenities: true,
            photos: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            speciality: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            transactionId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    console.log("🔄 PUT request for booking:", bookingId, "by user:", session.user.id);

    // Check permissions
    if (!(await canAccessBooking(session.user.role, session.user.id, bookingId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        roomId: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
        userId: true,
        room: {
          select: { hourlyRate: true },
        },
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();
    console.log("📥 Request body:", body);
    const validatedData = updateBookingSchema.parse(body);
    console.log("✅ Validated data:", validatedData);

    // Additional permission checks for specific fields
    if (
      validatedData.status &&
      ["CENTER_OWNER", "TRAINING_MANAGER", "ADMIN"].includes(session.user.role) === false &&
      existingBooking.userId !== session.user.id
    ) {
      return NextResponse.json(
        {
          error: "Forbidden: Only center owners and admins can change booking status",
        },
        { status: 403 },
      );
    }

    if (
      (validatedData.paymentMethod || validatedData.paymentStatus) &&
      session.user.role !== "ADMIN" &&
      !["CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)
    ) {
      return NextResponse.json(
        {
          error: "Forbidden: Only center owners and admins can change payment details",
        },
        { status: 403 },
      );
    }

    // Check for time conflicts if time is being changed
    if (validatedData.date || validatedData.startTime || validatedData.endTime) {
      const newDate = validatedData.date ? new Date(validatedData.date) : existingBooking.date;
      const newStartTime = validatedData.startTime || existingBooking.startTime;
      const newEndTime = validatedData.endTime || existingBooking.endTime;

      // Ensure times are strings for DateTime construction
      const newStartTimeStr = typeof newStartTime === 'string' ? newStartTime : newStartTime.toTimeString().slice(0, 5);
      const newEndTimeStr = typeof newEndTime === 'string' ? newEndTime : newEndTime.toTimeString().slice(0, 5);

      // Create DateTime objects for time comparisons
      const newStartDateTime = new Date(`${newDate.toISOString().split('T')[0]}T${newStartTimeStr}:00Z`);
      const newEndDateTime = new Date(`${newDate.toISOString().split('T')[0]}T${newEndTimeStr}:00Z`);

      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: bookingId }, // Exclude current booking
          roomId: existingBooking.roomId,
          date: newDate,
          status: "CONFIRMED", // Only prevent conflicts with CONFIRMED bookings
          OR: [
            {
              AND: [{ startTime: { lte: newStartDateTime } }, { endTime: { gt: newStartDateTime } }],
            },
            {
              AND: [{ startTime: { lt: newEndDateTime } }, { endTime: { gte: newEndDateTime } }],
            },
            {
              AND: [{ startTime: { gte: newStartDateTime } }, { endTime: { lte: newEndDateTime } }],
            },
          ],
        },
      });

      if (conflictingBooking) {
        return NextResponse.json({ error: "Time slot is already booked by a confirmed reservation" }, { status: 400 });
      }

      // Recalculate amounts if time changed
      if (validatedData.startTime || validatedData.endTime) {
        const startTimeStr = typeof newStartTime === "string" ? newStartTime : newStartTime.toTimeString().slice(0, 5);
        const endTimeStr = typeof newEndTime === "string" ? newEndTime : newEndTime.toTimeString().slice(0, 5);

        const { totalAmount, commission } = calculateBookingAmount(
          Number(existingBooking.room.hourlyRate),
          startTimeStr,
          endTimeStr,
        );
        // Add calculated fields to update data
        (validatedData as any).totalAmount = totalAmount;
        (validatedData as any).commission = commission;
      }
    }

    // Transform string values to DateTime objects for Prisma
    const updateData: any = { ...validatedData };

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    if (updateData.startTime) {
      updateData.startTime = new Date(`1970-01-01T${updateData.startTime}:00Z`);
    }

    if (updateData.endTime) {
      updateData.endTime = new Date(`1970-01-01T${updateData.endTime}:00Z`);
    }

    console.log("💾 Updating booking with data:", updateData);
    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        roomId: true,
        userId: true,
        date: true,
        startTime: true,
        endTime: true,
        totalAmount: true,
        commission: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        notes: true,
        cancelReason: true,
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
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            hourlyRate: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    console.log("✅ Booking updated successfully:", updatedBooking.id);
    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Zod validation error:", error.errors);
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("💥 Error updating booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete booking
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Check permissions
    if (!(await canAccessBooking(session.user.role, session.user.id, bookingId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        userId: true,
        paymentStatus: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow deletion by booking owner or admin
    if (existingBooking.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only booking owner or admin can delete booking" }, { status: 403 });
    }

    // Check if booking can be deleted
    if (existingBooking.status === "COMPLETED") {
      return NextResponse.json({ error: "Cannot delete completed booking" }, { status: 400 });
    }

    if (existingBooking.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Cannot delete paid booking. Please process refund first." }, { status: 400 });
    }

    // Delete booking (this will cascade delete related records)
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
