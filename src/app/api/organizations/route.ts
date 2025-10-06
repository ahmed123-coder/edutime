import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Validation schemas
const createOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(), // Slug will be generated from name if not provided
  description: z.string().optional(),
  type: z.enum(["TRAINING_CENTER", "PARTNER_SERVICE"]),
  subscription: z.enum(["ESSENTIAL", "PRO", "PREMIUM"]).optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  hours: z
    .object({
      monday: z.object({ open: z.string(), close: z.string() }).optional(),
      tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
      wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
      thursday: z.object({ open: z.string(), close: z.string() }).optional(),
      friday: z.object({ open: z.string(), close: z.string() }).optional(),
      saturday: z.object({ open: z.string(), close: z.string() }).optional(),
      sunday: z.object({ open: z.string(), close: z.string() }).optional(),
    })
    .optional(),
});

// Function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Function to ensure slug uniqueness
const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingOrg) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(["TRAINING_CENTER", "PARTNER_SERVICE"]).optional(),
  subscription: z.enum(["ESSENTIAL", "PRO", "PREMIUM"]).optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zipCode: z.string(),
    })
    .optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  hours: z
    .object({
      monday: z.object({ open: z.string(), close: z.string() }).optional(),
      tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
      wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
      thursday: z.object({ open: z.string(), close: z.string() }).optional(),
      friday: z.object({ open: z.string(), close: z.string() }).optional(),
      saturday: z.object({ open: z.string(), close: z.string() }).optional(),
      sunday: z.object({ open: z.string(), close: z.string() }).optional(),
    })
    .optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
});

// Helper function to check permissions
function canAccessOrganizations(userRole: string) {
  return ["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(userRole);
}

// GET /api/organizations - List organizations with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessOrganizations(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const verified = searchParams.get("verified");
    const active = searchParams.get("active");

    const skip = (page - 1) * limit;

    // Build where clause based on user permissions
    const whereClause: any = {};

    // Apply role-based filtering
    if (session.user.role === "CENTER_OWNER" || session.user.role === "TRAINING_MANAGER") {
      // Only show organizations where user is a member
      whereClause.members = {
        some: {
          userId: session.user.id,
        },
      };
    }

    // Apply search filters
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      whereClause.type = type;
    }

    if (verified !== null && verified !== undefined) {
      whereClause.verified = verified === "true";
    }

    if (active !== null && active !== undefined) {
      whereClause.active = active === "true";
    }

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
          type: true,
          subscription: true,
          subscriptionEnd: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          verified: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          members: {
            where: { role: "OWNER" },
            select: {
              id: true,
              role: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
              rooms: true,
              bookings: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.organization.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      organizations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and center owners can create organizations
    if (!["ADMIN", "CENTER_OWNER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createOrganizationSchema.parse(body);

    // Generate unique slug from name if not provided
    const baseSlug = validatedData.slug || generateSlug(validatedData.name);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Create organization and add creator as owner
    const organization = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: validatedData.name,
          slug: uniqueSlug,
          description: validatedData.description,
          type: validatedData.type,
          subscription: validatedData.subscription || "ESSENTIAL", // Default to ESSENTIAL if not provided
          address: validatedData.address,
          coordinates: validatedData.coordinates,
          phone: validatedData.phone,
          email: validatedData.email,
          website: validatedData.website,
          hours: validatedData.hours,
          verified: session.user.role === "ADMIN", // Admins can create pre-verified organizations
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
          type: true,
          subscription: true,
          subscriptionEnd: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          verified: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Add creator as owner
      await tx.organizationMember.create({
        data: {
          userId: session.user.id,
          organizationId: org.id,
          role: "OWNER",
        },
      });

      return org;
    });

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error creating organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
