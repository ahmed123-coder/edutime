import { MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Localisation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="bg-muted mb-4 flex h-64 w-full items-center justify-center rounded-lg">
          <div className="space-y-2 text-center">
            <MapPin className="text-muted-foreground mx-auto h-8 w-8" />
            <p className="text-muted-foreground">Carte interactive</p>
            <p className="text-muted-foreground text-sm">Avenue Habib Bourguiba, Tunis</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Navigation className="mr-2 h-4 w-4" />
            Itinéraire
          </Button>
          <Button variant="outline" size="sm">
            Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
