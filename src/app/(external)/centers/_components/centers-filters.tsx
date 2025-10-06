"use client";

import { useState } from "react";

import { Filter, MapPin, DollarSign, Users, Wifi, Car, Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const locations = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "coffee", label: "Café/Thé", icon: Coffee },
  { id: "projector", label: "Projecteur", icon: Users },
  { id: "microphone", label: "Microphone", icon: Users },
  { id: "camera", label: "Caméra", icon: Users },
];

export function CentersFilters() {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenityId]);
    } else {
      setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId));
    }
  };

  const clearFilters = () => {
    setLocation("");
    setPriceRange([0, 500]);
    setSelectedAmenities([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            <MapPin className="mr-1 inline h-4 w-4" />
            Localisation
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un gouvernorat" />
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

        <Separator />

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Prix par heure
          </label>
          <div className="px-2">
            <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={10} className="mb-2" />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>{priceRange[0]} DT</span>
              <span>{priceRange[1]} DT</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <label className="mb-3 block text-sm font-medium">Équipements</label>
          <div className="space-y-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                />
                <label htmlFor={amenity.id} className="flex cursor-pointer items-center space-x-2 text-sm">
                  <amenity.icon className="h-4 w-4" />
                  <span>{amenity.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Effacer les filtres
        </Button>
      </CardContent>
    </Card>
  );
}
