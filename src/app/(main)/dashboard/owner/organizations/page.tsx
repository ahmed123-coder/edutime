import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { OrganizationsManagement } from "./_components/organizations-management";

export const metadata: Metadata = {
  title: "My Organizations | Center Dashboard",
  description: "Manage your training centers and organizations",
};

export default async function OrganizationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (!session.user.verified) {
    redirect('/auth/verify-email');
  }

  // Check if user has center owner or training manager role
  if (!['CENTER_OWNER', 'TRAINING_MANAGER'].includes(session.user.role)) {
    redirect('/dashboard'); // Redirect to their appropriate dashboard
  }

  return <OrganizationsManagement />;
}
