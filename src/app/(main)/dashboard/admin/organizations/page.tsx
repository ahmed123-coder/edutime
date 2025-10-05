import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { OrganizationsManagement } from "./_components/organizations-management";

export const metadata: Metadata = {
  title: "Organizations Management | Admin Dashboard",
  description: "Manage training centers and partner organizations",
};

export default async function OrganizationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (!session.user.verified) {
    redirect('/auth/verify-email');
  }

  // Check if user has admin role
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard'); // Redirect to their appropriate dashboard
  }

  return <OrganizationsManagement />;
}
