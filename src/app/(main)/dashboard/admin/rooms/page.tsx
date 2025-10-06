import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { RoomsManagement } from "./_components/rooms-management";

export const metadata: Metadata = {
  title: "Rooms Management | Admin Dashboard",
  description: "Manage training rooms and spaces across all organizations",
};

export default async function RoomsPage() {
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

  return <RoomsManagement />;
}
