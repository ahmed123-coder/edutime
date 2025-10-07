import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { OrganizationsManagement } from "./_components/organizations-management";

export const metadata: Metadata = {
  title: "Gestion des Organisations | Tableau de bord Admin",
  description: "Gérer les centres de formation et organisations partenaires",
};

export default async function OrganizationsPage() {
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

  return <OrganizationsManagement />;
}
