import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Validation schema for updates
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'CENTER_OWNER', 'TRAINING_MANAGER', 'TEACHER', 'PARTNER']).optional(),
  speciality: z.string().optional(),
  verified: z.boolean().optional(),
});

// Helper function to check permissions
function canAccessUser(userRole: string, targetUserId: string, sessionUserId: string, targetUserRole?: string) {
  // Users can always access their own data
  if (targetUserId === sessionUserId) {
    return true;
  }

  switch (userRole) {
    case 'ADMIN':
      return true; // Admins can access all users
    case 'CENTER_OWNER':
    case 'TRAINING_MANAGER':
      // Center owners can access teachers and partners in their organization
      return targetUserRole === 'TEACHER' || targetUserRole === 'PARTNER';
    case 'TEACHER':
    case 'PARTNER':
      // Teachers and partners can only access their own data
      return false;
    default:
      return false;
  }
}

// GET /api/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    // Get user first to check permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!canAccessUser(session.user.role, userId, session.user.id, user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    // Get user first to check permissions
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!canAccessUser(session.user.role, userId, session.user.id, existingUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Additional permission checks for specific fields
    if (validatedData.role && session.user.role !== 'ADMIN') {
      // Only admins can change roles
      return NextResponse.json({ error: 'Forbidden: Only admins can change user roles' }, { status: 403 });
    }

    if (validatedData.verified !== undefined && session.user.role !== 'ADMIN') {
      // Only admins can change verification status
      return NextResponse.json({ error: 'Forbidden: Only admins can change verification status' }, { status: 403 });
    }

    // Center owners can only assign teacher/partner roles
    if (validatedData.role && 
        (session.user.role === 'CENTER_OWNER' || session.user.role === 'TRAINING_MANAGER') && 
        !['TEACHER', 'PARTNER'].includes(validatedData.role)) {
      return NextResponse.json({ error: 'Forbidden: Can only assign teacher or partner roles' }, { status: 403 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
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

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    // Get user first to check permissions
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can delete users, and users cannot delete themselves
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Only admins can delete users' }, { status: 403 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
