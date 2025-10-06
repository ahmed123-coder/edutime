import { MapPin, Calendar, Users, Globe, CheckCircle, Star, Share, Heart } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PartnerHeaderProps {
  partner: {
    name: string;
    description: string;
    logo: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    location: string;
    founded: number;
    employees: string;
    website: string;
    specialties: string[];
    certifications: string[];
  };
}

export function PartnerHeader({ partner }: PartnerHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span>Accueil</span> / <span>Partenaires</span> / <span className="text-foreground">{partner.name}</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo */}
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage src={partner.logo} alt={partner.name} />
          <AvatarFallback className="text-2xl">
            {partner.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{partner.name}</h1>
                {partner.verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{partner.rating}</span>
                  <span>({partner.reviewCount} avis)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.location}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed">
            {partner.description}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-4">
            {partner.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Fondé en</div>
            <div className="font-semibold">{partner.founded}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Employés</div>
            <div className="font-semibold">{partner.employees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-sm text-muted-foreground">Site web</div>
            <a 
              href={`https://${partner.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {partner.website}
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      {partner.certifications.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Certifications et labels</h3>
            <div className="flex flex-wrap gap-2">
              {partner.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
