import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Validation schema for updates
const updateOrganizationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(['TRAINING_CENTER', 'PARTNER_SERVICE']).optional(),
  subscription: z.enum(['ESSENTIAL', 'PRO', 'PREMIUM']).optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  hours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string() }).optional(),
  }).optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
});

// Helper function to check permissions
async function canAccessOrganization(userRole: string, userId: string, organizationId: string) {
  if (userRole === 'ADMIN') {
    return true; // Admins can access all organizations
  }

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  return !!membership;
}

// GET /api/organizations/[id] - Get specific organization
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = params.id;

    // Check permissions
    if (!(await canAccessOrganization(session.user.role, session.user.id, organizationId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
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
        hours: true,
        phone: true,
        email: true,
        website: true,
        verified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            id: true,
            role: true,
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
            rooms: true,
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({ organization });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/organizations/[id] - Update organization
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = params.id;

    // Check permissions
    if (!(await canAccessOrganization(session.user.role, session.user.id, organizationId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    if (!existingOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateOrganizationSchema.parse(body);

    // Additional permission checks for specific fields
    if ((validatedData.verified !== undefined || validatedData.active !== undefined) && 
        session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Forbidden: Only admins can change verification or active status' 
      }, { status: 403 });
    }

    // Update organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: validatedData,
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
        hours: true,
        phone: true,
        email: true,
        website: true,
        verified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ organization: updatedOrganization });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/organizations/[id] - Delete organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = params.id;

    // Only admins can delete organizations
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can delete organizations' }, { status: 403 });
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true },
    });

    if (!existingOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Delete organization (this will cascade delete related records)
    await prisma.organization.delete({
      where: { id: organizationId },
    });

    return NextResponse.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
