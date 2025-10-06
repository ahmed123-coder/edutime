import Link from "next/link";
import { Star, MapPin, Award, ChevronLeft, Shield, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpecialistHeaderProps {
  specialist: {
    id: string;
    name: string;
    title: string;
    speciality: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    experience: number;
    location: string;
    avatar: string;
    availability: string;
  };
}

export function SpecialistHeader({ specialist }: SpecialistHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link href="/specialists" className="hover:text-primary">Spécialistes</Link>
          <span>/</span>
          <span>{specialist.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/specialists">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux spécialistes
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Avatar */}
          <Avatar className="w-24 h-24">
            <AvatarImage src={specialist.avatar} alt={specialist.name} />
            <AvatarFallback className="text-2xl">
              {specialist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{specialist.name}</h1>
                  {specialist.verified && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Vérifié</span>
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl text-muted-foreground mb-2">{specialist.title}</h2>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{specialist.rating}</span>
                    <span>({specialist.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{specialist.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>{specialist.experience} ans d'expérience</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{specialist.availability}</span>
                  </Badge>
                  <Badge variant="secondary">{specialist.speciality}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
