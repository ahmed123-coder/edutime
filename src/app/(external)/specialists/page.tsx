import { Metadata } from "next";
import { SpecialistsHero } from "./_components/specialists-hero";
import { SpecialistsList } from "./_components/specialists-list";
import { SpecialistsFilters } from "./_components/specialists-filters";

export const metadata: Metadata = {
  title: "Spécialistes | SaaS Formation",
  description: "Découvrez nos spécialistes et formateurs experts. Trouvez le formateur idéal pour vos besoins de formation.",
  keywords: "spécialistes, formateurs, experts, formation, Tunisie",
};

export default function SpecialistsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SpecialistsHero />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SpecialistsFilters />
            </div>
          </div>

          {/* Specialists List */}
          <div className="lg:col-span-3">
            <SpecialistsList />
          </div>
        </div>
      </div>
    </div>
  );
}
