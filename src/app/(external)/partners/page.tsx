import { Metadata } from "next";
import Link from "next/link";

import { Building, Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Partenaires | SaaS Formation",
  description:
    "Découvrez nos partenaires de services. Consultants, experts et prestataires pour accompagner vos projets de formation.",
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
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Nos partenaires de services</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Découvrez notre réseau de partenaires experts, prêts à vous accompagner dans vos projets de formation et de
            développement.
          </p>

          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Building className="text-primary h-8 w-8" />
              </div>
              <div className="mb-2 text-3xl font-bold">50+</div>
              <div className="text-muted-foreground">Partenaires actifs</div>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Star className="text-secondary h-8 w-8" />
              </div>
              <div className="mb-2 text-3xl font-bold">4.8/5</div>
              <div className="text-muted-foreground">Satisfaction client</div>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CheckCircle className="text-accent h-8 w-8" />
              </div>
              <div className="mb-2 text-3xl font-bold">100%</div>
              <div className="text-muted-foreground">Partenaires vérifiés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Partenaires disponibles</h2>
                <p className="text-muted-foreground">{partners.length} partenaires trouvés</p>
              </div>
            </div>

            <div className="grid gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Logo */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={partner.logo} alt={partner.name} />
                        <AvatarFallback className="text-lg">
                          {partner.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <div className="mb-1 flex items-center space-x-2">
                              <h3 className="text-xl font-semibold">{partner.name}</h3>
                              {partner.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                            </div>

                            <Badge variant="secondary" className="mb-2">
                              {partner.type}
                            </Badge>

                            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
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
                            <div className="text-primary text-lg font-bold">{partner.priceRange}</div>
                            <div className="text-muted-foreground text-sm">par mission</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">{partner.description}</p>

                        {/* Services */}
                        <div className="mb-4">
                          <h4 className="mb-2 text-sm font-medium">Services proposés:</h4>
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
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline">Demander un devis</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <Card className="from-primary/5 to-secondary/5 mt-12 border-0 bg-gradient-to-br">
              <CardContent className="p-8 text-center">
                <h3 className="mb-4 text-2xl font-bold">Vous êtes un prestataire de services ?</h3>
                <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
                  Rejoignez notre réseau de partenaires et développez votre activité en proposant vos services à notre
                  communauté de centres de formation.
                </p>
                <Button size="lg">
                  Devenir partenaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
