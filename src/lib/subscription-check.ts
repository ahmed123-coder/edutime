import { prisma } from '@/lib/db';

export async function hasActiveSubscription(userId: string, userRole: string): Promise<boolean> {
  // Admins always have access
  if (userRole === 'ADMIN') {
    return true;
  }

  // Check if user belongs to an organization with active subscription
  const userOrganizations = await prisma.organizationMember.findMany({
    where: { userId },
    include: {
      organization: {
        include: {
          subscriptions: {
            where: {
              status: 'ACTIVE',
              endDate: {
                gt: new Date(), // Not expired
              },
            },
          },
        },
      },
    },
  });

  // Return true if user has at least one organization with active subscription
  return userOrganizations.some(
    (member) => member.organization.subscriptions.length > 0
  );
}
