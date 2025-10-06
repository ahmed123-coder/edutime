"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Users, Calendar, DollarSign, Wifi, Car, Coffee, Monitor, Mic, Camera, Shield, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const amenities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "coffee", label: "Café/Thé", icon: Coffee },
  { id: "projector", label: "Projecteur", icon: Monitor },
  { id: "microphone", label: "Microphone", icon: Mic },
  { id: "camera", label: "Caméra", icon: Camera },
  { id: "security", label: "Sécurité", icon: Shield },
];

const capacityRanges = [
  { value: "1-10", label: "1-10 personnes" },
  { value: "11-25", label: "11-25 personnes" },
  { value: "26-50", label: "26-50 personnes" },
  { value: "51-100", label: "51-100 personnes" },
  { value: "100+", label: "100+ personnes" },
];

interface SearchFiltersProps {
  searchParams: Record<string, string | undefined>;
}

export function SearchFilters({ searchParams }: SearchFiltersProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const [capacity, setCapacity] = useState(searchParams.capacity || "all");
  const [date, setDate] = useState(searchParams.date || "");
  const [startTime, setStartTime] = useState(searchParams.startTime || "");
  const [endTime, setEndTime] = useState(searchParams.endTime || "");
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.minPrice || "0"),
    parseInt(searchParams.maxPrice || "500"),
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.amenities ? searchParams.amenities.split(",") : [],
  );

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentSearchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page"); // Reset pagination
    router.push(`/search?${params.toString()}`);
  };

  const handleCapacityChange = (value: string) => {
    setCapacity(value);
    updateSearchParams({ capacity: value === "all" ? undefined : value });
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    updateSearchParams({ date: value || undefined });
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    if (field === "startTime") {
      setStartTime(value);
      updateSearchParams({ startTime: value || undefined });
    } else {
      setEndTime(value);
      updateSearchParams({ endTime: value || undefined });
    }
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    updateSearchParams({
      minPrice: values[0] > 0 ? values[0].toString() : undefined,
      maxPrice: values[1] < 500 ? values[1].toString() : undefined,
    });
  };

  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setSelectedAmenities(newAmenities);
    updateSearchParams({
      amenities: newAmenities.length > 0 ? newAmenities.join(",") : undefined,
    });
  };

  const clearAllFilters = () => {
    setCapacity("all");
    setDate("");
    setStartTime("");
    setEndTime("");
    setPriceRange([0, 500]);
    setSelectedAmenities([]);
    router.push("/search");
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          <X className="mr-2 h-4 w-4" />
          Effacer
        </Button>
      </div>

      {/* Capacity Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            Capacité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={capacity} onValueChange={handleCapacityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Nombre de personnes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes capacités</SelectItem>
              {capacityRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Date & Time Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date et Heure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date" className="text-sm">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime" className="text-sm">
                De
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-sm">
                À
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm">
            <DollarSign className="mr-2 h-4 w-4" />
            Prix par heure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={handlePriceChange} max={500} min={0} step={10} className="w-full" />
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>{priceRange[0]} DT</span>
            <span>{priceRange[1] >= 500 ? "500+ DT" : `${priceRange[1]} DT`}</span>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Équipements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={selectedAmenities.includes(amenity.id)}
                  onCheckedChange={() => handleAmenityToggle(amenity.id)}
                />
                <Label htmlFor={amenity.id} className="flex cursor-pointer items-center text-sm">
                  <amenity.icon className="text-muted-foreground mr-2 h-4 w-4" />
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
