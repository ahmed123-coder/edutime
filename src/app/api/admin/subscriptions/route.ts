import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const assignSubscriptionSchema = z.object({
  organizationId: z.string().cuid(),
  packageId: z.string().cuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  autoRenew: z.boolean().default(true),
});

// GET /api/admin/subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const organizationId = searchParams.get('organizationId');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (organizationId) where.organizationId = organizationId;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            }
          },
          package: {
            select: {
              id: true,
              name: true,
              plan: true,
              price: true,
              billingPeriod: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ]);

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/subscriptions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = assignSubscriptionSchema.parse(body);

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: validatedData.organizationId },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check if package exists
    const package_ = await prisma.subscriptionPackage.findUnique({
      where: { id: validatedData.packageId },
    });

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Cancel any existing active subscription
    await prisma.subscription.updateMany({
      where: {
        organizationId: validatedData.organizationId,
        status: 'ACTIVE',
      },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'Replaced by new subscription',
      },
    });

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        organizationId: validatedData.organizationId,
        packageId: validatedData.packageId,
        status: 'ACTIVE',
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        autoRenew: validatedData.autoRenew,
        nextPaymentDate: new Date(validatedData.endDate),
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        package: {
          select: {
            id: true,
            name: true,
            plan: true,
            price: true,
          }
        }
      },
    });

    // Update organization subscription plan
    await prisma.organization.update({
      where: { id: validatedData.organizationId },
      data: {
        subscription: package_.plan,
        subscriptionEnd: new Date(validatedData.endDate),
      },
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
