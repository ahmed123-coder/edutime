import { Metadata } from "next";

import { CentersFilters } from "./_components/centers-filters";
import { CentersHero } from "./_components/centers-hero";
import { CentersList } from "./_components/centers-list";

export const metadata: Metadata = {
  title: "Centres de formation | SaaS Formation",
  description:
    "Découvrez tous les centres de formation partenaires de SaaS Formation. Trouvez le centre idéal pour vos besoins de formation.",
  keywords: "centres formation, salles formation, espaces formation, Tunisie",
};

export default function CentersPage() {
  return (
    <div className="bg-background min-h-screen">
      <CentersHero />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CentersFilters />
            </div>
          </div>

          {/* Centers List */}
          <div className="lg:col-span-3">
            <CentersList />
          </div>
        </div>
      </div>
    </div>
  );
}
