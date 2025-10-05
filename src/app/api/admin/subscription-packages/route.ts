import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createPackageSchema = z.object({
  name: z.string().min(1),
  plan: z.enum(['ESSENTIAL', 'PRO', 'PREMIUM']),
  description: z.string().optional(),
  price: z.number().positive(),
  billingPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  features: z.array(z.string()),
  limits: z.object({
    maxRooms: z.number().positive(),
    maxBookingsPerMonth: z.number().positive(),
    maxMembers: z.number().positive(),
  }),
});

// GET /api/admin/subscription-packages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packages = await prisma.subscriptionPackage.findMany({
      orderBy: [
        { plan: 'asc' },
        { price: 'asc' }
      ],
      include: {
        _count: {
          select: { subscriptions: true }
        }
      }
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/subscription-packages
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPackageSchema.parse(body);

    const package_ = await prisma.subscriptionPackage.create({
      data: {
        name: validatedData.name,
        plan: validatedData.plan,
        description: validatedData.description,
        price: validatedData.price,
        billingPeriod: validatedData.billingPeriod,
        features: validatedData.features,
        limits: validatedData.limits,
      },
    });

    return NextResponse.json({ package: package_ }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error creating package:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
