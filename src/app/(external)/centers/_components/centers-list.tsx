import Link from "next/link";

import { Star, MapPin, Users, Wifi, Car, Coffee, CheckCircle, Heart, Share } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock centers data
const centers = [
  {
    id: "1",
    name: "Centre Excellence Formation",
    description: "Centre moderne avec équipements de pointe pour formations professionnelles",
    image: "/centers/excellence.jpg",
    rating: 4.8,
    reviewCount: 124,
    location: "Tunis Centre",
    address: "Avenue Habib Bourguiba, Tunis",
    priceRange: "50-120 DT/h",
    roomCount: 8,
    maxCapacity: 100,
    verified: true,
    amenities: ["wifi", "parking", "coffee", "projector"],
    features: ["Climatisation", "Sécurité 24/7", "Accès handicapés"],
  },
  {
    id: "2",
    name: "TechHub Formation",
    description: "Espace dédié aux formations technologiques et digitales",
    image: "/centers/techhub.jpg",
    rating: 4.9,
    reviewCount: 89,
    location: "Ariana",
    address: "Zone Industrielle Ariana",
    priceRange: "40-100 DT/h",
    roomCount: 6,
    maxCapacity: 80,
    verified: true,
    amenities: ["wifi", "parking", "projector", "microphone"],
    features: ["Équipement IT", "Fibre optique", "Salles modulables"],
  },
  {
    id: "3",
    name: "Business Center Sousse",
    description: "Centre d'affaires avec salles de formation équipées",
    image: "/centers/business.jpg",
    rating: 4.7,
    reviewCount: 156,
    location: "Sousse",
    address: "Avenue Léopold Sédar Senghor, Sousse",
    priceRange: "35-90 DT/h",
    roomCount: 12,
    maxCapacity: 150,
    verified: true,
    amenities: ["wifi", "parking", "coffee", "camera"],
    features: ["Vue mer", "Restaurant", "Service traiteur"],
  },
  {
    id: "4",
    name: "Innovation Lab Sfax",
    description: "Laboratoire d'innovation pour formations créatives",
    image: "/centers/innovation.jpg",
    rating: 4.6,
    reviewCount: 67,
    location: "Sfax",
    address: "Route de Tunis, Sfax",
    priceRange: "45-110 DT/h",
    roomCount: 5,
    maxCapacity: 60,
    verified: false,
    amenities: ["wifi", "projector", "microphone"],
    features: ["Espaces créatifs", "Matériel audiovisuel", "Jardin"],
  },
];

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  projector: Users,
  microphone: Users,
  camera: Users,
};

export function CentersList() {
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centres de formation</h2>
          <p className="text-muted-foreground">{centers.length} centres trouvés</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Trier par:</span>
          <select className="rounded border px-2 py-1 text-sm">
            <option>Pertinence</option>
            <option>Note</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
            <option>Distance</option>
          </select>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid gap-6">
        {centers.map((center) => (
          <Card key={center.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-0">
              <div className="grid gap-0 md:grid-cols-3">
                {/* Image */}
                <div className="relative">
                  <div className="bg-muted flex aspect-[4/3] items-center justify-center">
                    <span className="text-muted-foreground">Photo du centre</span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:col-span-2">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">{center.name}</h3>
                        {center.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      </div>

                      <div className="text-muted-foreground mb-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          <span className="font-medium">{center.rating}</span>
                          <span>({center.reviewCount} avis)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{center.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-primary text-lg font-bold">{center.priceRange}</div>
                      <div className="text-muted-foreground text-sm">par heure</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{center.description}</p>

                  <div className="text-muted-foreground mb-4 text-sm">
                    <strong>Adresse:</strong> {center.address}
                  </div>

                  {/* Stats */}
                  <div className="mb-4 flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{center.roomCount} salles</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Max {center.maxCapacity} pers.</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4 flex items-center space-x-3">
                    {center.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                      return (
                        <div key={amenity} className="text-muted-foreground flex items-center space-x-1 text-xs">
                          <Icon className="h-3 w-3" />
                        </div>
                      );
                    })}
                    {center.amenities.length > 4 && (
                      <span className="text-muted-foreground text-xs">+{center.amenities.length - 4} autres</span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {center.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button asChild className="flex-1">
                      <Link href={`/centers/${center.id}`}>Voir les détails</Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Réserver maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Charger plus de centres
        </Button>
      </div>
    </div>
  );
}
