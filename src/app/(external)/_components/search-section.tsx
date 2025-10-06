"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const popularSearches = [
  "Salle de formation Tunis",
  "Centre informatique",
  "Formation langues",
  "Espace coworking",
  "Salle de conférence",
];

const locations = [
  "Tunis",
  "Sfax", 
  "Sousse",
  "Monastir",
  "Bizerte",
  "Gabès",
  "Kairouan",
];

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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trouvez votre espace idéal
            </h2>
            <p className="text-lg text-muted-foreground">
              Recherchez parmi des centaines de centres et salles de formation
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search Query */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
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
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
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
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-sm text-muted-foreground mb-4">Recherches populaires :</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
