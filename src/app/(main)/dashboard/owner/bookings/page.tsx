import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { BookingsManagement } from "./_components/bookings-management";

export const metadata: Metadata = {
  title: "Bookings | Center Dashboard",
  description: "Manage bookings for your training centers",
};

export default async function BookingsPage() {
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

  return <BookingsManagement />;
}
