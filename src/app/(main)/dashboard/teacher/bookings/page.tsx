import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { BookingsManagement } from "./_components/bookings-management";

export const metadata: Metadata = {
  title: "My Bookings | Teacher Dashboard",
  description: "Manage your training room bookings",
};

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.verified) {
    redirect("/auth/verify-email");
  }

  // Check if user has teacher or partner role
  if (!["TEACHER", "PARTNER"].includes(session.user.role)) {
    redirect("/dashboard"); // Redirect to their appropriate dashboard
  }

  return <BookingsManagement />;
}
