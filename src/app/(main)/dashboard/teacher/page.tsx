import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { TeacherDashboard } from "./_components/teacher-dashboard";

export const metadata: Metadata = {
  title: "Teacher Dashboard | SaaS Formation",
  description: "Find and book training spaces for your classes",
};

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (!session.user.verified) {
    redirect('/auth/verify-email');
  }

  // Check if user has teacher role
  if (session.user.role !== 'TEACHER') {
    redirect('/dashboard'); // Redirect to their appropriate dashboard
  }

  return <TeacherDashboard />;
}
