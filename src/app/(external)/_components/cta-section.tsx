import Link from "next/link";
import { ArrowRight, CheckCircle, Users, Building } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  "Accès à plus de 500 centres vérifiés",
  "Réservation instantanée 24/7",
  "Paiement sécurisé intégré",
  "Support client dédié",
  "Géolocalisation avancée",
  "Système d'avis authentiques",
];

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Prêt à transformer votre{" "}
              <span className="text-primary">expérience formation</span> ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à notre plateforme 
              pour leurs besoins en espaces de formation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/auth/register">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/search">
                  Explorer les centres
                </Link>
              </Button>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Trainers/Users */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Pour les Formateurs</h3>
                <p className="text-muted-foreground mb-6">
                  Trouvez et réservez l'espace parfait pour vos formations. 
                  Accédez à des centaines de salles équipées.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/register?type=trainer">
                    Créer un compte formateur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Gratuit • Sans engagement
                </p>
              </CardContent>
            </Card>

            {/* For Centers */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Pour les Centres</h3>
                <p className="text-muted-foreground mb-6">
                  Augmentez votre visibilité et optimisez l'occupation de vos espaces. 
                  Gérez vos réservations facilement.
                </p>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/auth/register?type=center">
                    Rejoindre en tant que centre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Essai gratuit 30 jours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground mb-4">
              Ils nous font déjà confiance :
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
