import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { RoomsManagement } from "./_components/rooms-management";

export const metadata: Metadata = {
  title: "My Rooms | Center Dashboard",
  description: "Manage your training rooms and spaces",
};

export default async function RoomsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (!session.user.verified) {
    redirect('/auth/verify-email');
  }

  // Check if user has center owner or training manager role
  if (!['CENTER_OWNER', 'TRAINING_MANAGER'].includes(session.user.role)) {
    redirect('/dashboard'); // Redirect to their appropriate dashboard
  }

  return <RoomsManagement />;
}
