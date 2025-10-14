"use client";

import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Organization {
  id: string;
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface MapComponentProps {
   organizations: Organization[];
 }

 const MapComponent: React.FC<MapComponentProps> = ({ organizations }) => {
   const mapRef = useRef<L.Map>(null);
   const defaultLat = 36.7948545; // Tunis latitude
   const defaultLng = 10.7063772; // Tunis longitude

   // Use first organization's coordinates as center, or default
   const centerLat = organizations.length > 0 ? (organizations[0].coordinates?.lat || defaultLat) : defaultLat;
   const centerLng = organizations.length > 0 ? (organizations[0].coordinates?.lng || defaultLng) : defaultLng;

   const ResizeHandler = () => {
     const map = useMap();

     useEffect(() => {
       // Invalidate size when component mounts
       const timeoutId = setTimeout(() => {
         map.invalidateSize();
       }, 100);

       return () => clearTimeout(timeoutId);
     }, [map]);

     return null;
   };

   useEffect(() => {
     if (organizations.length > 1 && mapRef.current) {
       const bounds = L.latLngBounds(
         organizations.map(org => [
           org.coordinates?.lat || defaultLat,
           org.coordinates?.lng || defaultLng
         ] as LatLngTuple)
       );
       mapRef.current.fitBounds(bounds, { padding: [20, 20] });
     }
   }, [organizations]);

   // Cleanup map on unmount
   useEffect(() => {
     return () => {
       if (mapRef.current) {
         mapRef.current.remove();
       }
     };
   }, []);

   return (
     <div className="h-96 w-full overflow-hidden rounded-lg">
       <MapContainer
         key={`${centerLat}-${centerLng}`}
         center={[centerLat, centerLng]}
         zoom={organizations.length > 1 ? undefined : 15}
         ref={mapRef}
         style={{ height: '100%', width: '100%', maxHeight: '100%', maxWidth: '100%' }}
       >
         <TileLayer
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         />
         <ResizeHandler />
         {organizations.map((org) => {
           const lat = org.coordinates?.lat || defaultLat;
           const lng = org.coordinates?.lng || defaultLng;
           const address = [
             org.address?.street,
             org.address?.city,
             org.address?.state,
             org.address?.country
           ].filter(Boolean).join(", ");

           return (
             <Marker key={org.id} position={[lat, lng]}>
               <Popup>
                 <div className="text-center">
                   <h4 className="font-semibold">{org.name}</h4>
                   {address && (
                     <p className="text-sm text-muted-foreground mt-1">
                       {address}
                     </p>
                   )}
                 </div>
               </Popup>
             </Marker>
           );
         })}
       </MapContainer>
     </div>
   );
 };

export default MapComponent;