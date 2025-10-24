import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { OwnerPortfolio } from "./_components/owner-portfolio";

export const metadata: Metadata = {
  title: "Portfolio Propriétaire | Admin",
  description: "Détails et gestion du portfolio du propriétaire",
};

export default async function OwnerPortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <OwnerPortfolio isAdmin={true} />;
}