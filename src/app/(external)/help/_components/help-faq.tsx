"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const popularFAQs = [
  {
    question: "Comment réserver une salle de formation ?",
    answer: "Pour réserver une salle, utilisez notre moteur de recherche en sélectionnant vos critères (lieu, date, capacité). Choisissez la salle qui vous convient et suivez le processus de réservation. Le paiement se fait en ligne de manière sécurisée.",
    popular: true,
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer: "Oui, vous pouvez annuler votre réservation gratuitement jusqu'à 24 heures avant la date prévue. Connectez-vous à votre compte et accédez à la section 'Mes réservations' pour procéder à l'annulation.",
    popular: true,
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons les paiements par Konnect, ClickToPay, cartes bancaires (Visa, Mastercard) et virements bancaires. Tous les paiements sont sécurisés et cryptés.",
    popular: true,
  },
  {
    question: "Comment devenir centre partenaire ?",
    answer: "Pour rejoindre notre réseau, remplissez le formulaire de candidature sur notre site. Notre équipe vérifiera votre dossier et vous contactera dans les 48 heures pour finaliser votre inscription.",
    popular: false,
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, tous nos tarifs sont transparents. Les frais de service (10%) sont clairement indiqués avant le paiement. Aucun frais supplémentaire n'est ajouté après la réservation.",
    popular: false,
  },
  {
    question: "Comment contacter le support ?",
    answer: "Vous pouvez nous contacter par email (support@saasformation.tn), téléphone (+216 71 123 456) ou via le chat en direct disponible sur notre site. Notre équipe répond dans les 2 heures pendant les heures ouvrables.",
    popular: false,
  },
];

export function HelpFAQ() {
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
            Voici les réponses aux questions les plus posées par nos utilisateurs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {popularFAQs.map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto text-left"
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg font-medium">{faq.question}</CardTitle>
                      {faq.popular && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Populaire</span>
                        </Badge>
                      )}
                    </div>
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
