import { Calendar, CreditCard, Settings, Users, Building, HelpCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  {
    icon: Calendar,
    title: "Réservations",
    description: "Comment réserver, modifier ou annuler une réservation",
    articles: 8,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: CreditCard,
    title: "Paiements",
    description: "Moyens de paiement, facturation et remboursements",
    articles: 6,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Building,
    title: "Centres partenaires",
    description: "Rejoindre la plateforme et gérer votre centre",
    articles: 12,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Users,
    title: "Compte utilisateur",
    description: "Création, gestion et paramètres de votre compte",
    articles: 5,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Settings,
    title: "Paramètres",
    description: "Configuration et personnalisation de la plateforme",
    articles: 7,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: HelpCircle,
    title: "Problèmes techniques",
    description: "Résolution des problèmes et dépannage",
    articles: 9,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export function HelpCategories() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Parcourir par catégorie</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Explorez nos guides organisés par thème pour trouver rapidement les informations dont vous avez besoin.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card key={index} className="group cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="pb-4">
                <div className={`h-12 w-12 rounded-lg ${category.bgColor} mb-4 flex items-center justify-center`}>
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{category.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {category.articles} article{category.articles > 1 ? "s" : ""}
                  </span>
                  <Button variant="ghost" size="sm" className="transition-transform group-hover:translate-x-1">
                    Voir tout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
