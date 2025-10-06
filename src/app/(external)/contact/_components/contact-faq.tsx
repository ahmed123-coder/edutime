"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "Comment puis-je réserver une salle de formation ?",
    answer:
      "Vous pouvez réserver une salle en utilisant notre moteur de recherche sur la page d'accueil. Sélectionnez vos critères (localisation, date, capacité) et choisissez parmi les options disponibles. Le paiement se fait en ligne de manière sécurisée.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons les paiements par Konnect, ClickToPay, cartes bancaires et virements. Tous les paiements sont sécurisés et cryptés.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer:
      "Oui, vous pouvez annuler gratuitement jusqu'à 24 heures avant votre réservation. Les annulations tardives peuvent être soumises à des frais selon les conditions du centre.",
  },
  {
    question: "Comment devenir partenaire de la plateforme ?",
    answer:
      "Pour rejoindre notre réseau de centres partenaires, contactez-nous via le formulaire ou par email. Notre équipe vous guidera dans le processus d'inscription et de vérification.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer:
      "Non, tous nos tarifs sont transparents. Les frais de service sont clairement indiqués avant le paiement. Aucun frais supplémentaire n'est ajouté.",
  },
  {
    question: "Comment contacter un centre directement ?",
    answer:
      "Sur la page de chaque centre, vous trouverez les informations de contact (téléphone, email). Vous pouvez également utiliser notre système de messagerie intégré.",
  },
];

export function ContactFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Questions fréquentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border">
              <Button
                variant="ghost"
                className="h-auto w-full justify-between p-4 text-left"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                )}
              </Button>

              {openItems.includes(index) && (
                <div className="px-4 pb-4">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-muted/50 mt-6 rounded-lg p-4 text-center">
          <p className="text-muted-foreground mb-2 text-sm">Vous ne trouvez pas la réponse à votre question ?</p>
          <Button variant="outline" size="sm">
            Contactez notre support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
