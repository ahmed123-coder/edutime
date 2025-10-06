"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Filter, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const locations = [
  "Tunis", "Sfax", "Sousse", "Monastir", "Bizerte", "Gabès", "Kairouan"
];

const categories = [
  "Informatique", "Langues", "Management", "Marketing", "Finance", 
  "Ressources Humaines", "Design", "Développement Personnel"
];

export function SearchHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "all");
  const [category, setCategory] = useState(searchParams.get("category") || "all");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (query) params.set("q", query);
    else params.delete("q");

    if (location && location !== "all") params.set("location", location);
    else params.delete("location");

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    params.delete("page"); // Reset pagination

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setQuery("");
    setLocation("all");
    setCategory("all");
    router.push("/search");
  };

  const activeFiltersCount = [
    searchParams.get("q"),
    searchParams.get("location"),
    searchParams.get("category"),
    searchParams.get("capacity"),
    searchParams.get("date"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("amenities"),
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des espaces, centres, spécialistes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Location Filter */}
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full lg:w-48 h-12">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Localisation" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc.toLowerCase()}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full lg:w-48 h-12">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Catégorie" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button onClick={handleSearch} size="lg" className="w-full lg:w-auto px-8">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>

        {/* Active Filters & Actions */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {activeFiltersCount > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""} :
                </span>
                
                {searchParams.get("q") && (
                  <Badge variant="secondary">
                    Recherche: {searchParams.get("q")}
                  </Badge>
                )}
                
                {searchParams.get("location") && (
                  <Badge variant="secondary">
                    Lieu: {searchParams.get("location")}
                  </Badge>
                )}
                
                {searchParams.get("category") && (
                  <Badge variant="secondary">
                    Catégorie: {searchParams.get("category")}
                  </Badge>
                )}
                
                {searchParams.get("capacity") && (
                  <Badge variant="secondary">
                    Capacité: {searchParams.get("capacity")}
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Effacer tout
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
