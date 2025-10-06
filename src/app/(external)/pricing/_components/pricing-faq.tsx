"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata."
  },
  {
    question: "Que se passe-t-il après l'essai gratuit ?",
    answer: "Après 30 jours d'essai, vous devrez choisir un plan payant pour continuer à utiliser la plateforme. Aucun paiement automatique n'est effectué sans votre accord."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, nos tarifs sont transparents. Le prix affiché inclut toutes les fonctionnalités du plan. Seuls les frais de transaction des paiements (2,9%) sont facturés séparément."
  },
  {
    question: "Puis-je annuler mon abonnement ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'annulation prend effet à la fin de votre période de facturation."
  },
  {
    question: "Proposez-vous des remises pour les associations ?",
    answer: "Oui, nous offrons des tarifs préférentiels pour les associations, ONG et établissements éducatifs. Contactez-nous pour plus d'informations."
  },
  {
    question: "Comment fonctionne la facturation annuelle ?",
    answer: "Avec la facturation annuelle, vous payez une fois par an et économisez 17% par rapport au tarif mensuel. La facturation se fait à la date d'anniversaire de votre souscription."
  },
];

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Questions fréquentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vous avez des questions sur nos tarifs ? 
            Voici les réponses aux questions les plus courantes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto text-left"
                    onClick={() => toggleItem(index)}
                  >
                    <CardTitle className="text-lg font-medium">{faq.question}</CardTitle>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0" />
                    )}
                  </Button>
                </CardHeader>
                
                {openItems.includes(index) && (
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
