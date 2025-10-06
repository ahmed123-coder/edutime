import { Wifi, Car, Coffee, Monitor, Mic, Snowflake, Shield, Accessibility, MapPin, Navigation } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CenterInfoProps {
  center: {
    amenities: string[];
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

const amenityIcons: Record<string, any> = {
  "WiFi haut débit": Wifi,
  "Parking gratuit": Car,
  "Café/Thé": Coffee,
  "Projecteur HD": Monitor,
  "Système audio": Mic,
  Climatisation: Snowflake,
  "Sécurité 24/7": Shield,
  "Accès handicapés": Accessibility,
};

export function CenterInfo({ center }: CenterInfoProps) {
  return (
    <div className="space-y-6">
      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Équipements et services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {center.amenities.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity];
              return (
                <div key={index} className="flex items-center space-x-3">
                  {IconComponent && <IconComponent className="text-primary h-5 w-5" />}
                  <span className="text-sm">{amenity}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-4">{center.address}</p>

            {/* Map Placeholder */}
            <div className="bg-muted mb-4 flex h-64 w-full items-center justify-center rounded-lg">
              <div className="space-y-2 text-center">
                <MapPin className="text-muted-foreground mx-auto h-8 w-8" />
                <p className="text-muted-foreground">Carte interactive</p>
                <p className="text-muted-foreground text-sm">
                  Lat: {center.coordinates.lat}, Lng: {center.coordinates.lng}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Itinéraire
              </Button>
              <Button variant="outline" className="flex-1">
                Voir sur Google Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Politiques du centre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Réservation</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Réservation minimum 2 heures à l'avance</li>
                <li>• Confirmation automatique</li>
                <li>• Paiement sécurisé en ligne</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Annulation</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Annulation gratuite jusqu'à 24h avant</li>
                <li>• Remboursement sous 3-5 jours ouvrés</li>
                <li>• Frais d'annulation tardive: 50%</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Règlement intérieur</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Respect des horaires de réservation</li>
                <li>• Maintien de la propreté des lieux</li>
                <li>• Interdiction de fumer</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Services inclus</h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Nettoyage après utilisation</li>
                <li>• Support technique sur demande</li>
                <li>• Accès aux équipements de base</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications et labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Centre Certifié</span>
            </Badge>
            <Badge variant="secondary">ISO 9001</Badge>
            <Badge variant="secondary">Accessibilité PMR</Badge>
            <Badge variant="secondary">Normes de sécurité</Badge>
            <Badge variant="secondary">Qualité Premium</Badge>
          </div>

          <p className="text-muted-foreground mt-4 text-sm">
            Ce centre respecte toutes les normes de qualité et de sécurité requises. Il est régulièrement audité pour
            maintenir ses certifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
