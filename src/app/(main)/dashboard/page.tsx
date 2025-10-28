import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getDefaultDashboardUrl } from "@/navigation/sidebar/get-sidebar-items";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.verified) {
    redirect("/auth/verify-email");
  }

  // Redirect to role-specific dashboard
  const defaultDashboardUrl = getDefaultDashboardUrl(session.user.role);
  redirect(defaultDashboardUrl);
}
