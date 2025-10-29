import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OwnerPortfolio } from "./_components/owner-portfolio";

export const metadata: Metadata = {
  title: "Mon Portfolio | Propriétaire",
  description: "Gérer mon portfolio et mes informations personnelles",
};

export default async function OwnerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!["CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return <OwnerPortfolio isAdmin={false} />;
}