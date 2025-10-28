import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ViewOrganizationProfile } from "./_components/view-organization-profile";

export const metadata: Metadata = {
  title: "Voir l'Organisation | Tableau de bord Centre",
  description: "Voir les détails de l'organisation",
};

interface ViewOrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewOrganizationPage({ params }: ViewOrganizationPageProps) {
  const { id } = await params;
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

  return <ViewOrganizationProfile organizationId={id} />;
}