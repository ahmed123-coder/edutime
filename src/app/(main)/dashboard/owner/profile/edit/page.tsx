import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EditOwnerProfile } from "./_components/edit-owner-profile";

export const metadata: Metadata = {
  title: "Modifier mon profil | Propriétaire",
  description: "Modifier mes informations personnelles",
};

export default async function EditOwnerProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!["CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return <EditOwnerProfile />;
}