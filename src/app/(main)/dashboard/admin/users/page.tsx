import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { UsersManagement } from "./_components/users-management";

export const metadata: Metadata = {
  title: "Gestion des Utilisateurs | Tableau de bord Admin",
  description: "Gérer les utilisateurs de la plateforme, les rôles et les permissions",
};

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.verified) {
    redirect("/auth/verify-email");
  }

  // Check if user has admin role
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard"); // Redirect to their appropriate dashboard
  }

  return <UsersManagement />;
}
