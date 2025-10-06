import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { SubscriptionManagement } from "./_components/subscription-management";

export const metadata: Metadata = {
  title: "Subscription Management | Admin Dashboard",
  description: "Manage subscription packages and organization subscriptions",
};

export default async function SubscriptionsPage() {
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

  return <SubscriptionManagement />;
}
