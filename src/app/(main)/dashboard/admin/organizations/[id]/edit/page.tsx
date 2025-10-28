import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EditOrganizationProfile } from "./_components/edit-organization-profile";

export const metadata: Metadata = {
  title: "Modifier l'Organisation | Tableau de bord Admin",
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

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <EditOrganizationProfile organizationId={id} />;
}