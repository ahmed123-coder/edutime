import { Metadata } from "next";

import { SpecialistsFilters } from "./_components/specialists-filters";
import { SpecialistsHero } from "./_components/specialists-hero";
import { SpecialistsList } from "./_components/specialists-list";

export const metadata: Metadata = {
  title: "Spécialistes | SaaS Formation",
  description:
    "Découvrez nos spécialistes et formateurs experts. Trouvez le formateur idéal pour vos besoins de formation.",
  keywords: "spécialistes, formateurs, experts, formation, Tunisie",
};

export default function SpecialistsPage() {
  return (
    <div className="bg-background min-h-screen">
      <SpecialistsHero />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
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
