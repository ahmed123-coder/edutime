import { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { SearchSection } from "./_components/search-section";
import { FeaturesSection } from "./_components/features-section";
import { StatsSection } from "./_components/stats-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTASection } from "./_components/cta-section";

export const metadata: Metadata = {
  title: "Plateforme de Gestion d'Espaces de Formation | SaaS Formation",
  description: "Trouvez et réservez des espaces de formation adaptés à vos besoins. Connectez-vous avec des centres de formation et des spécialistes qualifiés.",
  keywords: "formation, espaces, réservation, centres de formation, spécialistes, salles",
  openGraph: {
    title: "SaaS Formation - Plateforme de Gestion d'Espaces",
    description: "La solution complète pour la gestion et la réservation d'espaces de formation",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
