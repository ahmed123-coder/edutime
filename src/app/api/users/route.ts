import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'CENTER_OWNER', 'TRAINING_MANAGER', 'TEACHER', 'PARTNER']),
  speciality: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CENTER_OWNER', 'TRAINING_MANAGER', 'TEACHER', 'PARTNER']).optional(),
  speciality: z.string().optional(),
  verified: z.boolean().optional(),
});

// Helper function to check permissions
function canAccessUsers(userRole: string, targetRole?: string) {
  switch (userRole) {
    case 'ADMIN':
      return true; // Admins can access all users
    case 'CENTER_OWNER':
    case 'TRAINING_MANAGER':
      // Center owners can access teachers and partners in their organization
      return targetRole === 'TEACHER' || targetRole === 'PARTNER' || !targetRole;
    case 'TEACHER':
    case 'PARTNER':
      // Teachers and partners can only view users (read-only)
      return !targetRole; // Only for listing, not specific user access
    default:
      return false;
  }
}

// GET /api/users - List users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccessUsers(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const roleParam = searchParams.get('role') || '';
    const verified = searchParams.get('verified');
    
    // Normalize role parameter to uppercase with underscores
    const role = roleParam ? roleParam.toUpperCase().replace(/-/g, '_') : '';
    
    console.log('API Request:', { page, limit, search, roleParam, role, verified });

    const skip = (page - 1) * limit;

    // Build where clause based on user permissions
    let whereClause: any = {};

    // Apply role-based filtering
    if (session.user.role === 'CENTER_OWNER' || session.user.role === 'TRAINING_MANAGER') {
      // Only show teachers and partners
      if (role) {
        // If there's a specific role filter, check if it's allowed
        if (['TEACHER', 'PARTNER'].includes(role)) {
          whereClause.role = role;
        } else {
          // Role filter not allowed for this user type
          whereClause.role = { in: [] }; // Return no results
        }
      } else {
        // No specific role filter, show all allowed roles
        whereClause.role = { in: ['TEACHER', 'PARTNER'] };
      }
    } else if (role) {
      // Admins and other roles can use any role filter
      whereClause.role = role;
    }

    // Apply search filters
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (verified !== null && verified !== undefined) {
      whereClause.verified = verified === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          verified: true,
          avatar: true,
          speciality: true,
          createdAt: true,
          updatedAt: true,
          organizations: {
            select: {
              organization: {
                select: {
                  id: true,
                  name: true,
                  subscriptions: {
                    where: { status: 'ACTIVE' },
                    select: {
                      endDate: true,
                      package: {
                        select: {
                          name: true,
                          plan: true,
                        }
                      }
                    },
                    take: 1,
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and center owners can create users
    if (!['ADMIN', 'CENTER_OWNER', 'TRAINING_MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Center owners can only create teachers and partners
    if ((session.user.role === 'CENTER_OWNER' || session.user.role === 'TRAINING_MANAGER') && 
        !['TEACHER', 'PARTNER'].includes(validatedData.role)) {
      return NextResponse.json({ error: 'Forbidden: Can only create teachers and partners' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        password: hashedPassword,
        role: validatedData.role,
        speciality: validatedData.speciality,
        verified: session.user.role === 'ADMIN', // Admins can create pre-verified users
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        verified: true,
        avatar: true,
        speciality: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
