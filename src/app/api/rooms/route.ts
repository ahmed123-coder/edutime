import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Validation schemas
const createRoomSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  capacity: z.number().int().min(1),
  area: z.number().positive().optional(),
  hourlyRate: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).refine((val) => val > 0, { message: "Hourly rate must be positive" }),
  equipment: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
});

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
async function canAccessRooms(userRole: string, userId: string, organizationId?: string) {
  if (userRole === "ADMIN") {
    return true; // Admins can access all rooms
  }

  if (organizationId && ["CENTER_OWNER", "TRAINING_MANAGER"].includes(userRole)) {
    // Check if user is a member of the organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
      },
    });
    return !!membership;
  }

  return false;
}

// GET /api/rooms - List rooms with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and center owners can access rooms
    if (!["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const organizationId = searchParams.get("organizationId") || "";
    const active = searchParams.get("active");
    const minCapacity = searchParams.get("minCapacity");
    const maxCapacity = searchParams.get("maxCapacity");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");

    const skip = (page - 1) * limit;

    // Build where clause based on user permissions
    const whereClause: any = {};

    // Apply role-based filtering
    if (session.user.role === "CENTER_OWNER" || session.user.role === "TRAINING_MANAGER") {
      // Only show rooms from organizations where user is a member
      const userOrganizations = await prisma.organizationMember.findMany({
        where: { userId: session.user.id },
        select: { organizationId: true },
      });

      whereClause.organizationId = {
        in: userOrganizations.map((org) => org.organizationId),
      };
    }

    // Apply search filters
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (organizationId) {
      // Check if user can access this organization
      if (!(await canAccessRooms(session.user.role, session.user.id, organizationId))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      whereClause.organizationId = organizationId;
    }

    if (active !== null && active !== undefined) {
      whereClause.active = active === "true";
    }

    if (minCapacity) {
      whereClause.capacity = { ...whereClause.capacity, gte: parseInt(minCapacity) };
    }

    if (maxCapacity) {
      whereClause.capacity = { ...whereClause.capacity, lte: parseInt(maxCapacity) };
    }

    if (minRate) {
      whereClause.hourlyRate = { ...whereClause.hourlyRate, gte: parseFloat(minRate) };
    }

    if (maxRate) {
      whereClause.hourlyRate = { ...whereClause.hourlyRate, lte: parseFloat(maxRate) };
    }

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where: whereClause,
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
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.room.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      rooms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/rooms - Create new room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and center owners can create rooms
    if (!["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createRoomSchema.parse(body);

    // Check if user can access the organization
    if (!(await canAccessRooms(session.user.role, session.user.id, validatedData.organizationId))) {
      return NextResponse.json({ error: "Forbidden: Cannot create room in this organization" }, { status: 403 });
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
      select: { id: true },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Create room
    const room = await prisma.room.create({
      data: {
        organizationId: validatedData.organizationId,
        name: validatedData.name,
        description: validatedData.description,
        capacity: validatedData.capacity,
        area: validatedData.area,
        hourlyRate: validatedData.hourlyRate,
        equipment: validatedData.equipment,
        amenities: validatedData.amenities,
        photos: validatedData.photos,
      },
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

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
