import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  type: z.enum(["TRAINING_CENTER", "PARTNER_SERVICE"]).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  hours: z.record(z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean()
  })).optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
});

// GET /api/organizations/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organization = await prisma.organization.findUnique({
      where: { id },
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
        coordinates: true,
        phone: true,
        email: true,
        website: true,
        hours: true,
        verified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ organization });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/organizations/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateOrganizationSchema.parse(body);

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!existingOrg) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check permissions: Admin or organization member
    if (session.user.role !== "ADMIN" && existingOrg.members.length === 0) {
      return NextResponse.json({ error: "Forbidden: Not a member of this organization" }, { status: 403 });
    }

    // Clean up data
    const updateData: any = {};
    Object.keys(validatedData).forEach((key) => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updateData[key] = validatedData[key as keyof typeof validatedData];
      }
    });

    const organization = await prisma.organization.update({
      where: { id },
      data: updateData,
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
        coordinates: true,
        phone: true,
        email: true,
        website: true,
        hours: true,
        verified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ organization });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }

    console.error("Error updating organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/organizations/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only admins can delete organizations" }, { status: 403 });
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            rooms: true,
            bookings: true,
          },
        },
      },
    });

    if (!existingOrg) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Check if organization has active bookings
    if (existingOrg._count.bookings > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete organization with existing bookings. Please cancel all bookings first.",
        },
        { status: 400 },
      );
    }

    // Delete organization and all related data
    await prisma.$transaction(async (tx: any) => {
      // Delete organization members
      await tx.organizationMember.deleteMany({
        where: { organizationId: id },
      });

      // Delete rooms
      await tx.room.deleteMany({
        where: { organizationId: id },
      });

      // Delete organization
      await tx.organization.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

