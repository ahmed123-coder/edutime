import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EditOwnerProfile } from "./_components/edit-owner-profile";

export const metadata: Metadata = {
  title: "Modifier le profil propriétaire | Admin",
  description: "Modification du portfolio du propriétaire",
};

export default async function EditOwnerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <EditOwnerProfile />;
}