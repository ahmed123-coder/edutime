"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { Star, MapPin, Users, Clock, Wifi, Car, Coffee, Heart, Share2, Filter, Grid, List } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - In real app, this would come from API
const mockResults = [
  {
    id: "1",
    name: "Excellence Training Center",
    type: "TRAINING_CENTER",
    description: "Centre de formation moderne avec équipements de pointe",
    location: "Tunis Centre",
    address: "Avenue Habib Bourguiba, Tunis",
    rating: 4.8,
    reviewCount: 124,
    priceRange: "50-150 DT/h",
    image: "/images/center1.jpg",
    amenities: ["wifi", "parking", "coffee", "projector"],
    rooms: [
      { id: "r1", name: "Salle Alpha", capacity: 25, hourlyRate: 80 },
      { id: "r2", name: "Salle Beta", capacity: 50, hourlyRate: 120 },
    ],
    verified: true,
    distance: "1.2 km",
  },
  {
    id: "2",
    name: "Digital Academy",
    type: "TRAINING_CENTER",
    description: "Spécialisé en formations informatiques et digitales",
    location: "Sfax",
    address: "Route de Tunis, Sfax",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "40-100 DT/h",
    image: "/images/center2.jpg",
    amenities: ["wifi", "projector", "microphone"],
    rooms: [
      { id: "r3", name: "Lab 1", capacity: 20, hourlyRate: 60 },
      { id: "r4", name: "Lab 2", capacity: 30, hourlyRate: 90 },
    ],
    verified: true,
    distance: "2.5 km",
  },
  {
    id: "3",
    name: "Business Hub",
    type: "TRAINING_CENTER",
    description: "Espace moderne pour formations business et management",
    location: "Sousse",
    address: "Zone Touristique, Sousse",
    rating: 4.9,
    reviewCount: 156,
    priceRange: "60-200 DT/h",
    image: "/images/center3.jpg",
    amenities: ["wifi", "parking", "coffee", "security"],
    rooms: [
      { id: "r5", name: "Executive Room", capacity: 15, hourlyRate: 120 },
      { id: "r6", name: "Conference Hall", capacity: 100, hourlyRate: 200 },
    ],
    verified: true,
    distance: "0.8 km",
  },
];

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>;
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const [results, setResults] = useState(mockResults);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Filter and sort results based on search params
      let filteredResults = [...mockResults];

      // Apply filters here based on searchParams
      if (searchParams.location) {
        filteredResults = filteredResults.filter((result) =>
          result.location.toLowerCase().includes(searchParams.location!.toLowerCase()),
        );
      }

      // Sort results
      switch (sortBy) {
        case "price-low":
          filteredResults.sort((a, b) => parseInt(a.priceRange.split("-")[0]) - parseInt(b.priceRange.split("-")[0]));
          break;
        case "price-high":
          filteredResults.sort((a, b) => parseInt(b.priceRange.split("-")[0]) - parseInt(a.priceRange.split("-")[0]));
          break;
        case "rating":
          filteredResults.sort((a, b) => b.rating - a.rating);
          break;
        case "distance":
          filteredResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
          break;
      }

      setResults(filteredResults);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, sortBy]);

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    coffee: Coffee,
    projector: "📽️",
    microphone: "🎤",
    security: "🔒",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Skeleton className="h-24 w-32 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
          </h2>
          <p className="text-muted-foreground text-sm">Centres et espaces de formation disponibles</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Pertinence</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results List */}
      <div className="max-h-[calc(100vh-300px)] space-y-4 overflow-y-auto">
        {results.map((result) => (
          <Card key={result.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                {/* Image */}
                <div className="bg-muted flex h-24 w-32 flex-shrink-0 items-center justify-center rounded-lg">
                  <span className="text-muted-foreground text-sm">Image</span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{result.name}</h3>
                        {result.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground mb-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                          <span>({result.reviewCount} avis)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {result.location} • {result.distance}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{result.description}</p>

                      {/* Amenities */}
                      <div className="mb-3 flex items-center space-x-2">
                        {result.amenities.slice(0, 4).map((amenity) => {
                          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                          return (
                            <div key={amenity} className="text-muted-foreground flex items-center space-x-1 text-xs">
                              {typeof IconComponent === "string" ? (
                                <span>{IconComponent}</span>
                              ) : (
                                <IconComponent className="h-3 w-3" />
                              )}
                            </div>
                          );
                        })}
                        {result.amenities.length > 4 && (
                          <span className="text-muted-foreground text-xs">+{result.amenities.length - 4} autres</span>
                        )}
                      </div>

                      {/* Rooms */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span>
                            {result.rooms.length} salle{result.rooms.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Capacité: {Math.min(...result.rooms.map((r) => r.capacity))}-
                          {Math.max(...result.rooms.map((r) => r.capacity))} pers.
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="ml-4 flex-shrink-0 text-right">
                      <div className="mb-2 text-lg font-semibold">{result.priceRange}</div>

                      <div className="mb-3 flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button asChild className="w-full">
                        <Link href={`/centers/${result.id}`}>Voir détails</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">Aucun résultat trouvé pour votre recherche</div>
          <Button variant="outline">Modifier les filtres</Button>
        </div>
      )}
    </div>
  );
}
