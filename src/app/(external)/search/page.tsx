import { Suspense } from "react";

import { Metadata } from "next";

import { SearchFilters } from "./_components/search-filters";
import { SearchHeader } from "./_components/search-header";
import { SearchMap } from "./_components/search-map";
import { SearchResults } from "./_components/search-results";

export const metadata: Metadata = {
  title: "Recherche d'Espaces de Formation | SaaS Formation",
  description:
    "Trouvez et réservez des espaces de formation adaptés à vos besoins. Filtrez par localisation, capacité, équipements et plus encore.",
  keywords: "recherche, espaces formation, salles, centres, réservation, Tunisie",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    location?: string;
    category?: string;
    capacity?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    page?: string;
    view?: "list" | "map";
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="bg-background min-h-screen">
      <SearchHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Chargement des filtres...</div>}>
              <SearchFilters searchParams={searchParams} />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid h-[calc(100vh-200px)] gap-6 lg:grid-cols-2">
              {/* Results List */}
              <div className="overflow-hidden">
                <Suspense fallback={<div>Chargement des résultats...</div>}>
                  <SearchResults searchParams={searchParams} />
                </Suspense>
              </div>

              {/* Map */}
              <div className="hidden lg:block">
                <Suspense fallback={<div>Chargement de la carte...</div>}>
                  <SearchMap searchParams={searchParams} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
