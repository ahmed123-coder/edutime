import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EditOrganizationProfile } from "./_components/edit-organization-profile";

export const metadata: Metadata = {
  title: "Modifier l'Organisation | Tableau de bord Centre",
  description: "Modifier les détails de l'organisation",
};

interface EditOrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditOrganizationPage({ params }: EditOrganizationPageProps) {
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

  return <EditOrganizationProfile organizationId={id} />;
}