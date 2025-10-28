"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const popularSearches = [
  "Salle de formation Tunis",
  "Centre informatique",
  "Formation langues",
  "Espace coworking",
  "Salle de conférence",
];

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

export function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSearch = () => {
    // Construct search URL with parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (capacity) params.set("capacity", capacity);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <section id="search" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Trouvez votre espace idéal</h2>
            <p className="text-muted-foreground text-lg">
              Recherchez parmi des centaines de centres et salles de formation
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search Query */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Que recherchez-vous ?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                        <SelectValue placeholder="Localisation" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="text-muted-foreground mr-2 h-4 w-4" />
                        <SelectValue placeholder="Catégorie" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div>
                  <Button onClick={handleSearch} className="w-full" size="lg">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Users className="text-muted-foreground mr-2 h-4 w-4" />
                        <SelectValue placeholder="Capacité" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 personnes</SelectItem>
                      <SelectItem value="11-25">11-25 personnes</SelectItem>
                      <SelectItem value="26-50">26-50 personnes</SelectItem>
                      <SelectItem value="51-100">51-100 personnes</SelectItem>
                      <SelectItem value="100+">100+ personnes</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <Input type="date" placeholder="Date souhaitée" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input type="time" placeholder="Heure" />
                    <span className="text-muted-foreground">à</span>
                    <Input type="time" placeholder="Heure" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4 text-sm">Recherches populaires :</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
