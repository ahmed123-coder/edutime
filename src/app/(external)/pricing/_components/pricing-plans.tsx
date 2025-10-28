"use client";

import { useState } from "react";

import { Check, Star, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "Essential",
    description: "Parfait pour débuter",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      "Jusqu'à 3 salles",
      "Réservations illimitées",
      "Tableau de bord basique",
      "Support email",
      "Paiements sécurisés",
      "Profil public",
    ],
    limitations: ["Pas d'analytics avancées", "Pas de personnalisation"],
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Pro",
    description: "Le plus populaire",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      "Jusqu'à 10 salles",
      "Réservations illimitées",
      "Tableau de bord avancé",
      "Support prioritaire",
      "Paiements sécurisés",
      "Profil public premium",
      "Analytics détaillées",
      "Personnalisation basique",
      "API d'intégration",
    ],
    limitations: [],
    popular: true,
    color: "border-primary",
  },
  {
    name: "Premium",
    description: "Pour les grandes structures",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      "Salles illimitées",
      "Réservations illimitées",
      "Tableau de bord premium",
      "Support dédié 24/7",
      "Paiements sécurisés",
      "Profil public premium",
      "Analytics avancées",
      "Personnalisation complète",
      "API d'intégration",
      "Multi-utilisateurs",
      "Rapports personnalisés",
      "Formation incluse",
    ],
    limitations: [],
    popular: false,
    color: "border-purple-200",
  },
];

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Billing Toggle */}
        <div className="mb-12 text-center">
          <div className="bg-muted inline-flex items-center space-x-4 rounded-lg p-1">
            <span className={`rounded-md px-3 py-2 transition-colors ${!isYearly ? "bg-background shadow-sm" : ""}`}>
              Mensuel
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`rounded-md px-3 py-2 transition-colors ${isYearly ? "bg-background shadow-sm" : ""}`}>
              Annuel
              <Badge variant="secondary" className="ml-2">
                -17%
              </Badge>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? "scale-105 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="mr-1 h-3 w-3" />
                    Plus populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-8 text-center">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>

                <div className="mt-4">
                  <div className="text-4xl font-bold">{isYearly ? plan.yearlyPrice : plan.monthlyPrice} DT</div>
                  <div className="text-muted-foreground">/{isYearly ? "an" : "mois"}</div>
                  {isYearly && (
                    <div className="mt-1 text-sm text-green-600">
                      Économisez {plan.monthlyPrice * 12 - plan.yearlyPrice} DT/an
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="text-muted-foreground text-sm font-medium">Limitations :</div>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="text-muted-foreground text-sm">
                        • {limitation}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.popular && <Zap className="mr-2 h-4 w-4" />}
                  Commencer l'essai gratuit
                </Button>

                <p className="text-muted-foreground text-center text-xs">30 jours gratuits • Sans engagement</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <Card className="from-primary/5 to-secondary/5 mx-auto max-w-2xl border-0 bg-gradient-to-br">
            <CardContent className="p-8">
              <h3 className="mb-4 text-2xl font-bold">Besoin d'une solution sur mesure ?</h3>
              <p className="text-muted-foreground mb-6">
                Pour les grandes organisations avec des besoins spécifiques, nous proposons des solutions
                personnalisées.
              </p>
              <Button variant="outline" size="lg">
                Contactez notre équipe commerciale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
