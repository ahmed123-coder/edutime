import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { UsersManagement } from "./_components/users-management";

export const metadata: Metadata = {
  title: "Users Management | Center Dashboard",
  description: "Manage teachers and partners in your organization",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.verified) {
    redirect("/auth/verify-email");
  }

  // Check if user has center owner or training manager role
  if (!["CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
    redirect("/dashboard"); // Redirect to their appropriate dashboard
  }

  return <UsersManagement />;
}
