import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Validation schemas
const createBookingSchema = z.object({
  organizationId: z.string().min(1),
  roomId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'),
  notes: z.string().optional(),
});

const updateBookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format').optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  paymentMethod: z.enum(['KONNECT', 'CLICKTOPAY', 'ON_SITE', 'BANK_TRANSFER']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND']).optional(),
  notes: z.string().optional(),
  cancelReason: z.string().optional(),
});

// Helper function to check permissions
async function canAccessBookings(userRole: string, userId: string, organizationId?: string) {
  if (userRole === 'ADMIN') {
    return true; // Admins can access all bookings
  }

  if (organizationId && ['CENTER_OWNER', 'TRAINING_MANAGER'].includes(userRole)) {
    // Check if user is a member of the organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
      },
    });
    return !!membership;
  }

  // Teachers can access their own bookings
  return ['TEACHER', 'PARTNER'].includes(userRole);
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

// GET /api/bookings - List bookings with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const organizationId = searchParams.get('organizationId') || '';
    const roomId = searchParams.get('roomId') || '';
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const skip = (page - 1) * limit;

    // Build where clause based on user permissions
    let whereClause: any = {};

    // Apply role-based filtering
    if (session.user.role === 'TEACHER' || session.user.role === 'PARTNER') {
      // Teachers can only see their own bookings
      whereClause.userId = session.user.id;
    } else if (session.user.role === 'CENTER_OWNER' || session.user.role === 'TRAINING_MANAGER') {
      // Center owners can see bookings for their organizations
      const userOrganizations = await prisma.organizationMember.findMany({
        where: { userId: session.user.id },
        select: { organizationId: true },
      });
      
      whereClause.organizationId = {
        in: userOrganizations.map(org => org.organizationId),
      };
    }
    // Admins can see all bookings (no additional filtering)

    // Apply search filters
    if (organizationId) {
      // Check if user can access this organization
      if (!(await canAccessBookings(session.user.role, session.user.id, organizationId))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      whereClause.organizationId = organizationId;
    }

    if (roomId) {
      whereClause.roomId = roomId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }

    if (dateFrom) {
      whereClause.date = { ...whereClause.date, gte: new Date(dateFrom) };
    }

    if (dateTo) {
      whereClause.date = { ...whereClause.date, lte: new Date(dateTo) };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Verify room exists and get hourly rate
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      select: { 
        id: true, 
        organizationId: true, 
        hourlyRate: true, 
        active: true,
        name: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.active) {
      return NextResponse.json({ error: 'Room is not active' }, { status: 400 });
    }

    if (room.organizationId !== validatedData.organizationId) {
      return NextResponse.json({ error: 'Room does not belong to the specified organization' }, { status: 400 });
    }

    // Check if user can access the organization (for center owners) or if they're a teacher
    if (!['TEACHER', 'PARTNER'].includes(session.user.role)) {
      if (!(await canAccessBookings(session.user.role, session.user.id, validatedData.organizationId))) {
        return NextResponse.json({ error: 'Forbidden: Cannot create booking for this organization' }, { status: 403 });
      }
    }

    // Check for time conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: validatedData.roomId,
        date: new Date(validatedData.date),
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: validatedData.startTime } },
              { endTime: { gt: validatedData.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: validatedData.endTime } },
              { endTime: { gte: validatedData.endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: validatedData.startTime } },
              { endTime: { lte: validatedData.endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json({ error: 'Time slot is already booked' }, { status: 400 });
    }

    // Calculate amounts
    const { totalAmount, commission } = calculateBookingAmount(
      Number(room.hourlyRate),
      validatedData.startTime,
      validatedData.endTime
    );

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        organizationId: validatedData.organizationId,
        roomId: validatedData.roomId,
        userId: session.user.id,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        totalAmount,
        commission,
        status: 'PENDING',
        notes: validatedData.notes,
      },
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

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
