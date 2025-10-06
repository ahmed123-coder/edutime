import { 
  Calendar, 
  CreditCard, 
  Settings, 
  Users, 
  Building, 
  HelpCircle,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Parcourir par catégorie
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez nos guides organisés par thème pour trouver rapidement 
            les informations dont vous avez besoin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4`}>
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.articles} article{category.articles > 1 ? 's' : ''}
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                    Voir tout
                    <ArrowRight className="h-4 w-4 ml-2" />
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
