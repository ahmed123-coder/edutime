"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Share2, 
  Heart,
  ChevronLeft,
  Shield,
  Award
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CenterHeaderProps {
  center: {
    id: string;
    name: string;
    description: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    location: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    hours: Record<string, { open?: string; close?: string; closed?: boolean }>;
  };
}

export function CenterHeader({ center }: CenterHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const getCurrentStatus = () => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];

    const todayHours = center.hours?.[currentDay];

    if (!todayHours || todayHours.closed) {
      return { status: "Fermé", color: "text-red-600" };
    }

    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open?.replace(":", "") || "0");
    const closeTime = parseInt(todayHours.close?.replace(":", "") || "0");

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Ouvert", color: "text-green-600" };
    }

    return { status: "Fermé", color: "text-red-600" };
  };

  const status = getCurrentStatus();

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-primary">Recherche</Link>
          <span>/</span>
          <span>{center.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/search">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux résultats
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{center.name}</h1>
                  {center.verified && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Vérifié</span>
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Award className="h-3 w-3" />
                    <span>Premium</span>
                  </Badge>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{center.rating}</span>
                    <span>({center.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{center.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className={status.color}>{status.status}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {center.description}
                </p>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${center.phone}`} className="hover:text-primary">
                        {center.phone}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${center.email}`} className="hover:text-primary">
                        {center.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={center.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        Site web
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Horaires d'ouverture
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(center.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{
                        day === 'monday' ? 'Lundi' :
                        day === 'tuesday' ? 'Mardi' :
                        day === 'wednesday' ? 'Mercredi' :
                        day === 'thursday' ? 'Jeudi' :
                        day === 'friday' ? 'Vendredi' :
                        day === 'saturday' ? 'Samedi' : 'Dimanche'
                      }</span>
                      <span className={hours.closed ? 'text-red-600' : ''}>
                        {hours.closed ? 'Fermé' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
