import { Metadata } from "next";
import Link from "next/link";
import { Building, Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Partenaires | SaaS Formation",
  description: "Découvrez nos partenaires de services. Consultants, experts et prestataires pour accompagner vos projets de formation.",
  keywords: "partenaires, services, consultants, experts, SaaS Formation",
};

// Mock partners data
const partners = [
  {
    id: "1",
    name: "TechConseil Pro",
    type: "Conseil IT",
    description: "Spécialiste en conseil et formation technologique pour entreprises",
    logo: "/partners/techconseil.jpg",
    rating: 4.8,
    reviewCount: 156,
    location: "Tunis",
    verified: true,
    services: ["Formation IT", "Conseil Digital", "Transformation Numérique"],
    priceRange: "500-2000 DT",
  },
  {
    id: "2",
    name: "Marketing Plus",
    type: "Marketing Digital",
    description: "Agence spécialisée en stratégies marketing et formation commerciale",
    logo: "/partners/marketing.jpg",
    rating: 4.7,
    reviewCount: 89,
    location: "Sousse",
    verified: true,
    services: ["Formation Marketing", "Stratégie Digitale", "Social Media"],
    priceRange: "300-1500 DT",
  },
  {
    id: "3",
    name: "Design Studio",
    type: "Design & Créativité",
    description: "Studio créatif proposant formations en design et communication visuelle",
    logo: "/partners/design.jpg",
    rating: 4.9,
    reviewCount: 67,
    location: "Tunis",
    verified: false,
    services: ["Formation Design", "Branding", "Communication Visuelle"],
    priceRange: "400-1200 DT",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Nos partenaires de services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Découvrez notre réseau de partenaires experts, prêts à vous accompagner 
            dans vos projets de formation et de développement.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-muted-foreground">Partenaires actifs</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold mb-2">4.8/5</div>
              <div className="text-muted-foreground">Satisfaction client</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-muted-foreground">Partenaires vérifiés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Partenaires disponibles</h2>
                <p className="text-muted-foreground">{partners.length} partenaires trouvés</p>
              </div>
            </div>

            <div className="grid gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Logo */}
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={partner.logo} alt={partner.name} />
                        <AvatarFallback className="text-lg">
                          {partner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-xl font-semibold">{partner.name}</h3>
                              {partner.verified && (
                                <CheckCircle className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            
                            <Badge variant="secondary" className="mb-2">
                              {partner.type}
                            </Badge>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{partner.priceRange}</div>
                            <div className="text-sm text-muted-foreground">par mission</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {partner.description}
                        </p>

                        {/* Services */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Services proposés:</h4>
                          <div className="flex flex-wrap gap-2">
                            {partner.services.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <Button asChild>
                            <Link href={`/partners/${partner.id}`}>
                              Voir les détails
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button variant="outline">
                            Demander un devis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <Card className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Vous êtes un prestataire de services ?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Rejoignez notre réseau de partenaires et développez votre activité 
                  en proposant vos services à notre communauté de centres de formation.
                </p>
                <Button size="lg">
                  Devenir partenaire
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
