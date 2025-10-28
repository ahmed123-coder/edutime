"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Search, MapPin, Filter, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const locations = ["Tunis", "Sfax", "Sousse", "Monastir", "Bizerte", "Gabès", "Kairouan"];

const categories = [
  "Informatique",
  "Langues",
  "Management",
  "Marketing",
  "Finance",
  "Ressources Humaines",
  "Design",
  "Développement Personnel",
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
    <div className="sticky top-16 z-40 border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        {/* Main Search Bar */}
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Rechercher des espaces, centres, spécialistes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Location Filter */}
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 w-full lg:w-48">
              <div className="flex items-center">
                <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
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
            <SelectTrigger className="h-12 w-full lg:w-48">
              <div className="flex items-center">
                <Filter className="text-muted-foreground mr-2 h-4 w-4" />
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
          <Button onClick={handleSearch} size="lg" className="w-full px-8 lg:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>

        {/* Active Filters & Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {activeFiltersCount > 0 && (
              <>
                <span className="text-muted-foreground text-sm">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif
                  {activeFiltersCount > 1 ? "s" : ""} :
                </span>

                {searchParams.get("q") && <Badge variant="secondary">Recherche: {searchParams.get("q")}</Badge>}

                {searchParams.get("location") && (
                  <Badge variant="secondary">Lieu: {searchParams.get("location")}</Badge>
                )}

                {searchParams.get("category") && (
                  <Badge variant="secondary">Catégorie: {searchParams.get("category")}</Badge>
                )}

                {searchParams.get("capacity") && (
                  <Badge variant="secondary">Capacité: {searchParams.get("capacity")}</Badge>
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
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
