import { Clock, Users, DollarSign, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock services data
const services = [
  {
    id: "1",
    name: "Formation React & Next.js",
    category: "Développement Web",
    description:
      "Formation complète sur React et Next.js pour développeurs. Couvre les concepts avancés, les bonnes pratiques et les projets réels.",
    duration: "5 jours",
    maxParticipants: 12,
    price: 1200,
    features: [
      "Support de cours inclus",
      "Projets pratiques",
      "Certificat de formation",
      "Suivi post-formation 3 mois",
    ],
    level: "Intermédiaire",
    format: "Présentiel",
  },
  {
    id: "2",
    name: "Audit Sécurité IT",
    category: "Cybersécurité",
    description:
      "Audit complet de votre infrastructure IT pour identifier les vulnérabilités et proposer des solutions de sécurisation.",
    duration: "3 jours",
    maxParticipants: 1,
    price: 2500,
    features: [
      "Rapport détaillé",
      "Plan d'action prioritaire",
      "Recommandations personnalisées",
      "Suivi de mise en œuvre",
    ],
    level: "Expert",
    format: "Sur site",
  },
  {
    id: "3",
    name: "Transformation Digitale",
    category: "Conseil",
    description:
      "Accompagnement stratégique pour la transformation digitale de votre entreprise. Analyse, stratégie et mise en œuvre.",
    duration: "2 semaines",
    maxParticipants: 5,
    price: 5000,
    features: ["Diagnostic initial", "Stratégie personnalisée", "Accompagnement mise en œuvre", "Formation équipes"],
    level: "Tous niveaux",
    format: "Hybride",
  },
];

interface PartnerServicesProps {
  partnerId: string;
}

export function PartnerServices({ partnerId }: PartnerServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services proposés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="rounded-lg border p-6 transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-semibold">{service.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-primary text-2xl font-bold">{service.price} DT</div>
                      <div className="text-muted-foreground text-sm">par session</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>

                  {/* Service Details */}
                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span>
                        Max {service.maxParticipants} participant{service.maxParticipants > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {service.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {service.format}
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="mb-2 font-medium">Inclus dans cette prestation :</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                <Button className="flex-1">Demander un devis</Button>
                <Button variant="outline" className="flex-1">
                  Plus d'informations
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Service CTA */}
        <div className="bg-muted/50 mt-8 rounded-lg p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Besoin d'un service sur mesure ?</h3>
          <p className="text-muted-foreground mb-4">
            Nous proposons également des prestations personnalisées selon vos besoins spécifiques.
          </p>
          <Button variant="outline">Contactez-nous pour un devis personnalisé</Button>
        </div>
      </CardContent>
    </Card>
  );
}
