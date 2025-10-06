"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, Users, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock map data - In real app, this would integrate with Google Maps or similar
const mockMapData = [
  {
    id: "1",
    name: "Excellence Training Center",
    lat: 36.8065,
    lng: 10.1815,
    rating: 4.8,
    priceRange: "50-150 DT/h",
    verified: true,
    rooms: 5,
  },
  {
    id: "2",
    name: "Digital Academy",
    lat: 34.7406,
    lng: 10.7603,
    rating: 4.6,
    priceRange: "40-100 DT/h",
    verified: true,
    rooms: 3,
  },
  {
    id: "3",
    name: "Business Hub",
    lat: 35.8256,
    lng: 10.6369,
    rating: 4.9,
    priceRange: "60-200 DT/h",
    verified: true,
    rooms: 8,
  },
];

interface SearchMapProps {
  searchParams: Record<string, string | undefined>;
}

export function SearchMap({ searchParams }: SearchMapProps) {
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [mapData, setMapData] = useState(mockMapData);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to Tunis center
          setUserLocation({ lat: 36.8065, lng: 10.1815 });
        }
      );
    }
  }, []);

  // Filter map data based on search params
  useEffect(() => {
    let filteredData = [...mockMapData];
    
    if (searchParams.location) {
      // In real app, filter by location
      filteredData = filteredData.filter(center => 
        center.name.toLowerCase().includes(searchParams.location!.toLowerCase())
      );
    }
    
    setMapData(filteredData);
  }, [searchParams]);

  const selectedCenterData = mapData.find(center => center.id === selectedCenter);

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Carte interactive</h3>
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Ma position
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-muted/20">
        {/* Placeholder for actual map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">Carte interactive</p>
              <p className="text-sm text-muted-foreground">
                Intégration Google Maps à venir
              </p>
            </div>
          </div>
        </div>

        {/* Map Markers Simulation */}
        <div className="absolute inset-0 p-4">
          {mapData.map((center, index) => (
            <div
              key={center.id}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                selectedCenter === center.id ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 20}%`,
              }}
              onClick={() => setSelectedCenter(center.id)}
            >
              {/* Marker */}
              <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                selectedCenter === center.id 
                  ? 'bg-primary scale-125' 
                  : 'bg-white hover:bg-primary/10'
              }`}>
                <MapPin className={`h-4 w-4 ${
                  selectedCenter === center.id ? 'text-white' : 'text-primary'
                }`} />
              </div>

              {/* Price Badge */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {center.priceRange.split('-')[0]} DT/h
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Center Info */}
        {selectedCenterData && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{selectedCenterData.name}</h4>
                      {selectedCenterData.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedCenterData.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{selectedCenterData.rooms} salles</span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-semibold text-primary">
                      {selectedCenterData.priceRange}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm">
                      Voir détails
                    </Button>
                    <Button variant="outline" size="sm">
                      Itinéraire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="icon" className="bg-white">
            <span className="text-lg">+</span>
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <span className="text-lg">-</span>
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4">
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Centre sélectionné</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                  <span>Centres disponibles</span>
                </div>
                {userLocation && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Votre position</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
