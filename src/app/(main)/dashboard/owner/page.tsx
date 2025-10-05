import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { OwnerDashboard } from "./_components/owner-dashboard";

export const metadata: Metadata = {
  title: "Center Owner Dashboard | SaaS Formation",
  description: "Training center management dashboard",
};

export default async function OwnerDashboardPage() {
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

  return <OwnerDashboard />;
}
