import { OrganizationType, SubscriptionPlan, MemberRole } from "../../generated/prisma";
import { prisma } from "../prisma";

export interface CreateOrganizationData {
  name: string;
  slug?: string; // Optional - will be generated from name if not provided
  description?: string;
  type: OrganizationType;
  subscription?: SubscriptionPlan; // Optional - defaults to ESSENTIAL
  address: any;
  coordinates?: any;
  hours?: any;
  phone?: string;
  email?: string;
  website?: string;
  ownerId: string;
}

export async function createOrganization(data: CreateOrganizationData) {
  return await prisma.$transaction(async (tx) => {
    // Create organization
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        subscription: data.subscription,
        address: data.address,
        coordinates: data.coordinates,
        hours: data.hours,
        phone: data.phone,
        email: data.email,
        website: data.website,
        verified: false,
        active: true,
      },
    });

    // Add owner as organization member
    await tx.organizationMember.create({
      data: {
        userId: data.ownerId,
        organizationId: organization.id,
        role: MemberRole.OWNER,
      },
    });

    return organization;
  });
}

export async function getOrganizationById(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      rooms: {
        where: { active: true },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
          bookings: true,
        },
      },
    },
  });
}

export async function getOrganizationBySlug(slug: string) {
  return await prisma.organization.findUnique({
    where: { slug },
    include: {
      rooms: {
        where: { active: true },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
          bookings: true,
        },
      },
    },
  });
}

export async function getOrganizationsByType(type: OrganizationType) {
  return await prisma.organization.findMany({
    where: {
      type,
      active: true,
      verified: true,
    },
    include: {
      rooms: {
        where: { active: true },
        take: 3,
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrganization(id: string, data: Partial<CreateOrganizationData>) {
  return await prisma.organization.update({
    where: { id },
    data,
  });
}

export async function verifyOrganization(id: string) {
  return await prisma.organization.update({
    where: { id },
    data: { verified: true },
  });
}

export async function addOrganizationMember(organizationId: string, userId: string, role: MemberRole) {
  return await prisma.organizationMember.create({
    data: {
      organizationId,
      userId,
      role,
    },
  });
}

export async function removeOrganizationMember(organizationId: string, userId: string) {
  return await prisma.organizationMember.delete({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
}
