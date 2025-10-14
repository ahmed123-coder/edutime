import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { RoomsAvailability } from "./_components/rooms-availability";

export const metadata: Metadata = {
  title: "Disponibilité des Salles | Tableau de bord Centre",
  description: "Consulter la disponibilité des salles de formation",
};

export default async function AvailabilityPage() {
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

  return <RoomsAvailability />;
}