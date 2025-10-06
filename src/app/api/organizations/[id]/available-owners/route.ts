import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/organizations/[id]/available-owners
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: organizationId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view available owners
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true },
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Get current members of the organization
    const currentMembers = await prisma.organizationMember.findMany({
      where: { organizationId },
      select: { userId: true },
    });

    const currentMemberIds = currentMembers.map((member) => member.userId);

    // Build where clause for user search
    const whereClause: any = {
      role: "CENTER_OWNER", // Only CENTER_OWNER role users can be assigned as owners
      verified: true, // Only verified users
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get available users (CENTER_OWNER role, verified, not already members)
    const availableUsers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        speciality: true,
        createdAt: true,
        organizations: {
          select: {
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
      take: 50, // Limit results for performance
    });

    // Separate users into categories
    const notMembers = availableUsers.filter((user) => !currentMemberIds.includes(user.id));
    const currentOwners = availableUsers.filter(
      (user) =>
        currentMemberIds.includes(user.id) &&
        user.organizations.some((org) => org.organization.id === organizationId && org.role === "OWNER"),
    );
    const currentNonOwners = availableUsers.filter(
      (user) =>
        currentMemberIds.includes(user.id) &&
        user.organizations.some((org) => org.organization.id === organizationId && org.role !== "OWNER"),
    );

    return NextResponse.json({
      organization,
      users: {
        available: notMembers,
        currentOwners,
        currentNonOwners,
      },
      total: {
        available: notMembers.length,
        currentOwners: currentOwners.length,
        currentNonOwners: currentNonOwners.length,
      },
    });
  } catch (error) {
    console.error("Error fetching available owners:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
