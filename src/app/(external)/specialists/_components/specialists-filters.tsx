"use client";

import { useState } from "react";

import { Filter, MapPin, DollarSign, Award, Clock } from "lucide-react";

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

const specialties = [
  "Développement Web",
  "Marketing Digital",
  "Gestion de Projet",
  "Design UX/UI",
  "Data Science",
  "Cybersécurité",
  "Intelligence Artificielle",
  "Management",
  "Ressources Humaines",
  "Finance",
  "Communication",
  "Langues",
  "Bureautique",
  "Entrepreneuriat",
];

const certifications = [
  "Microsoft Certified",
  "Google Certified",
  "AWS Certified",
  "Scrum Master",
  "PMP",
  "ITIL",
  "Cisco Certified",
];

export function SpecialistsFilters() {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [experience, setExperience] = useState("");

  const handleCertificationChange = (certId: string, checked: boolean) => {
    if (checked) {
      setSelectedCertifications((prev) => [...prev, certId]);
    } else {
      setSelectedCertifications((prev) => prev.filter((id) => id !== certId));
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSpecialty("");
    setPriceRange([0, 200]);
    setSelectedCertifications([]);
    setExperience("");
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

        {/* Specialty */}
        <div>
          <label className="mb-2 block text-sm font-medium">Spécialité</label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une spécialité" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec.toLowerCase()}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Experience */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            <Clock className="mr-1 inline h-4 w-4" />
            Expérience
          </label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau d'expérience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">1-3 ans</SelectItem>
              <SelectItem value="intermediate">3-7 ans</SelectItem>
              <SelectItem value="senior">7-15 ans</SelectItem>
              <SelectItem value="expert">15+ ans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Tarif horaire
          </label>
          <div className="px-2">
            <Slider value={priceRange} onValueChange={setPriceRange} max={200} min={0} step={5} className="mb-2" />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>{priceRange[0]} DT</span>
              <span>{priceRange[1]} DT</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            <Award className="mr-1 inline h-4 w-4" />
            Certifications
          </label>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox
                  id={cert}
                  checked={selectedCertifications.includes(cert)}
                  onCheckedChange={(checked) => handleCertificationChange(cert, checked as boolean)}
                />
                <label htmlFor={cert} className="cursor-pointer text-sm">
                  {cert}
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
