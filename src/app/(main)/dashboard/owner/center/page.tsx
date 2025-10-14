import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { CenterProfile } from "./_components/center-profile";

export const metadata: Metadata = {
  title: "profil d'organisations | Tableau de bord Propriétaire",
  description: "Gérer le profil de votre centre de formation",
};

export default async function CenterPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.verified) {
    redirect("/auth/verify-email");
  }

  // Check if user has center owner role
  if (session.user.role !== "CENTER_OWNER") {
    redirect("/dashboard");
  }

  return <CenterProfile />;
}