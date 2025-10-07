import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { AdminDashboard } from "./_components/admin-dashboard";

export const metadata: Metadata = {
  title: "Tableau de bord Admin | SaaS Formation",
  description: "Tableau de bord d'administration et de gestion de la plateforme",
};

export default async function AdminDashboardPage() {
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

  return <AdminDashboard />;
}
