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
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA */}
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold lg:text-5xl">
              Prêt à transformer votre <span className="text-primary">expérience formation</span> ?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à notre plateforme pour leurs besoins en
              espaces de formation.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="px-8 text-lg">
                <Link href="/auth/register">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 text-lg">
                <Link href="/search">Explorer les centres</Link>
              </Button>
            </div>

            {/* Benefits List */}
            <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual CTA Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Trainers/Users */}
            <Card className="hover:border-primary/50 border-2 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Users className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Pour les Formateurs</h3>
                <p className="text-muted-foreground mb-6">
                  Trouvez et réservez l'espace parfait pour vos formations. Accédez à des centaines de salles équipées.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/register?type=trainer">
                    Créer un compte formateur
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-muted-foreground mt-4 text-sm">Gratuit • Sans engagement</p>
              </CardContent>
            </Card>

            {/* For Centers */}
            <Card className="hover:border-primary/50 border-2 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="bg-secondary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Building className="text-secondary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">Pour les Centres</h3>
                <p className="text-muted-foreground mb-6">
                  Augmentez votre visibilité et optimisez l'occupation de vos espaces. Gérez vos réservations
                  facilement.
                </p>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/auth/register?type=center">
                    Rejoindre en tant que centre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-muted-foreground mt-4 text-sm">Essai gratuit 30 jours</p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4 text-sm">Ils nous font déjà confiance :</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="bg-muted h-8 w-24 rounded" />
              <div className="bg-muted h-8 w-24 rounded" />
              <div className="bg-muted h-8 w-24 rounded" />
              <div className="bg-muted h-8 w-24 rounded" />
              <div className="bg-muted h-8 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
