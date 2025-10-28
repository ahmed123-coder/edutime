import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "../prisma";

export interface CreateBookingData {
  organizationId: string;
  roomId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  commission: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export async function checkRoomAvailability(
  roomId: string,
  date: Date,
  startTime: string,
  endTime: string,
): Promise<boolean> {
  const existingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      date,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      OR: [
        {
          AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
        {
          AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
        },
      ],
    },
  });

  return existingBookings.length === 0;
}

export async function createBooking(data: CreateBookingData) {
  return await prisma.$transaction(async (tx) => {
    // Check availability again within transaction
    const isAvailable = await checkRoomAvailability(data.roomId, data.date, data.startTime, data.endTime);

    if (!isAvailable) {
      throw new Error("Time slot is no longer available");
    }

    // Create booking
    const booking = await tx.booking.create({
      data: {
        organizationId: data.organizationId,
        roomId: data.roomId,
        userId: data.userId,
        date: data.date,
        startTime: new Date(`1970-01-01T${data.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${data.endTime}:00Z`),
        totalAmount: data.totalAmount,
        commission: data.commission,
        status: BookingStatus.PENDING,
        paymentMethod: data.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        notes: data.notes,
      },
      include: {
        room: true,
        organization: true,
        user: true,
      },
    });

    return booking;
  });
}

export async function getBookingById(id: string) {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      room: true,
      organization: true,
      user: true,
      payments: true,
    },
  });
}

export async function getBookingsByUser(userId: string) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      room: true,
      organization: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingsByOrganization(organizationId: string) {
  return await prisma.booking.findMany({
    where: { organizationId },
    include: {
      room: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingsByRoom(roomId: string, date?: Date) {
  const where: any = { roomId };
  if (date) {
    where.date = date;
  }

  return await prisma.booking.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus, reason?: string) {
  return await prisma.booking.update({
    where: { id },
    data: {
      status,
      ...(reason && { cancelReason: reason }),
    },
  });
}

export async function confirmBooking(id: string) {
  return await updateBookingStatus(id, BookingStatus.CONFIRMED);
}

export async function cancelBooking(id: string, reason?: string) {
  return await updateBookingStatus(id, BookingStatus.CANCELLED, reason);
}

export async function completeBooking(id: string) {
  return await updateBookingStatus(id, BookingStatus.COMPLETED);
}
