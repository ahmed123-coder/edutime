import { Metadata } from "next";
import { PricingHero } from "./_components/pricing-hero";
import { PricingPlans } from "./_components/pricing-plans";
import { PricingFAQ } from "./_components/pricing-faq";
import { PricingCTA } from "./_components/pricing-cta";

export const metadata: Metadata = {
  title: "Tarifs | SaaS Formation",
  description: "Découvrez nos plans tarifaires adaptés à tous les types de centres de formation. Essai gratuit de 30 jours.",
  keywords: "tarifs, prix, abonnement, centres formation, SaaS Formation",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PricingHero />
      <PricingPlans />
      <PricingFAQ />
      <PricingCTA />
    </div>
  );
}
