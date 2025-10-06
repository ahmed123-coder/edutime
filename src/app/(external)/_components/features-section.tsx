import { 
  Search, 
  Calendar, 
  CreditCard, 
  Shield, 
  Users, 
  MapPin,
  Clock,
  Star,
  Headphones
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Recherche intelligente",
    description: "Trouvez rapidement l'espace parfait grâce à nos filtres avancés et notre algorithme de recommandation.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Calendar,
    title: "Réservation en temps réel",
    description: "Vérifiez la disponibilité et réservez instantanément vos créneaux préférés.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    description: "Payez en toute sécurité avec Konnect, ClickToPay ou directement sur place.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Centres vérifiés",
    description: "Tous nos partenaires sont vérifiés et certifiés pour garantir la qualité.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Users,
    title: "Spécialistes qualifiés",
    description: "Accédez à un réseau de formateurs et spécialistes expérimentés.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: MapPin,
    title: "Géolocalisation",
    description: "Trouvez les centres les plus proches de vous avec notre carte interactive.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Clock,
    title: "Disponibilité 24/7",
    description: "Réservez à tout moment, notre plateforme est disponible 24h/24 et 7j/7.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Star,
    title: "Système d'avis",
    description: "Consultez les avis authentiques d'autres utilisateurs pour faire le bon choix.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Headphones,
    title: "Support client",
    description: "Notre équipe est là pour vous accompagner à chaque étape de votre réservation.",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les fonctionnalités qui font de nous la solution de référence 
            pour la gestion d'espaces de formation en Tunisie.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Plateforme sécurisée et certifiée</span>
          </div>
        </div>
      </div>
    </section>
  );
}
