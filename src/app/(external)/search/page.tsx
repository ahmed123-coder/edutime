import { Metadata } from "next";
import { Suspense } from "react";
import { SearchFilters } from "./_components/search-filters";
import { SearchResults } from "./_components/search-results";
import { SearchMap } from "./_components/search-map";
import { SearchHeader } from "./_components/search-header";

export const metadata: Metadata = {
  title: "Recherche d'Espaces de Formation | SaaS Formation",
  description: "Trouvez et réservez des espaces de formation adaptés à vos besoins. Filtrez par localisation, capacité, équipements et plus encore.",
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
    view?: 'list' | 'map';
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Chargement des filtres...</div>}>
              <SearchFilters searchParams={searchParams} />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
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
