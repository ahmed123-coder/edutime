"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  height?: number; // Optional height prop for responsive sizing
}

export function LocationPicker({ lat, lng, onLocationChange, searchQuery, onSearchChange, onSearch, height = 280 }: LocationPickerProps) {
  const mapRef = useRef<L.Map>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return <Marker position={[lat, lng]} />;
  };

  const ResizeHandler = () => {
    const map = useMap();

    useEffect(() => {
      // Invalidate size when component mounts (when tab becomes visible)
      const timeoutId = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [map]);

    return null;
  };

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Latitude and Longitude Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Latitude</label>
          <Input
            type="number"
            step="any"
            value={lat.toFixed(6)}
            onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, lng)}
            placeholder="Latitude"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Longitude</label>
          <Input
            type="number"
            step="any"
            value={lng.toFixed(6)}
            onChange={(e) => onLocationChange(lat, parseFloat(e.target.value) || 0)}
            placeholder="Longitude"
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
        <MapContainer key={`${lat}-${lng}`} center={[lat, lng]} zoom={13} ref={mapRef} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
          <ResizeHandler />
        </MapContainer>
        <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow-md">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un lieu..."
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="w-48"
            />
            <Button onClick={onSearch} size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}