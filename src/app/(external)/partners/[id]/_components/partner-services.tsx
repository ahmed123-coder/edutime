import { Clock, Users, DollarSign, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock services data
const services = [
  {
    id: "1",
    name: "Formation React & Next.js",
    category: "Développement Web",
    description: "Formation complète sur React et Next.js pour développeurs. Couvre les concepts avancés, les bonnes pratiques et les projets réels.",
    duration: "5 jours",
    maxParticipants: 12,
    price: 1200,
    features: [
      "Support de cours inclus",
      "Projets pratiques",
      "Certificat de formation",
      "Suivi post-formation 3 mois"
    ],
    level: "Intermédiaire",
    format: "Présentiel",
  },
  {
    id: "2",
    name: "Audit Sécurité IT",
    category: "Cybersécurité",
    description: "Audit complet de votre infrastructure IT pour identifier les vulnérabilités et proposer des solutions de sécurisation.",
    duration: "3 jours",
    maxParticipants: 1,
    price: 2500,
    features: [
      "Rapport détaillé",
      "Plan d'action prioritaire",
      "Recommandations personnalisées",
      "Suivi de mise en œuvre"
    ],
    level: "Expert",
    format: "Sur site",
  },
  {
    id: "3",
    name: "Transformation Digitale",
    category: "Conseil",
    description: "Accompagnement stratégique pour la transformation digitale de votre entreprise. Analyse, stratégie et mise en œuvre.",
    duration: "2 semaines",
    maxParticipants: 5,
    price: 5000,
    features: [
      "Diagnostic initial",
      "Stratégie personnalisée",
      "Accompagnement mise en œuvre",
      "Formation équipes"
    ],
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
            <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                      <Badge variant="outline" className="mb-2">{service.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{service.price} DT</div>
                      <div className="text-sm text-muted-foreground">par session</div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {service.maxParticipants} participant{service.maxParticipants > 1 ? 's' : ''}</span>
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
                    <h4 className="font-medium mb-2">Inclus dans cette prestation :</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button className="flex-1">
                  Demander un devis
                </Button>
                <Button variant="outline" className="flex-1">
                  Plus d'informations
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Service CTA */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Besoin d'un service sur mesure ?</h3>
          <p className="text-muted-foreground mb-4">
            Nous proposons également des prestations personnalisées selon vos besoins spécifiques.
          </p>
          <Button variant="outline">
            Contactez-nous pour un devis personnalisé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
