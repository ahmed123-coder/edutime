import { MapPin, Navigation } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Localisation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Carte interactive</p>
            <p className="text-sm text-muted-foreground">
              Avenue Habib Bourguiba, Tunis
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
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
