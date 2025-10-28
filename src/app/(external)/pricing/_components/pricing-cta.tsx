import Link from "next/link";

import { ArrowRight, Shield, Headphones, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Paiements sécurisés et données protégées",
  },
  {
    icon: Headphones,
    title: "Support inclus",
    description: "Équipe support dédiée pour vous accompagner",
  },
  {
    icon: Zap,
    title: "Mise en route rapide",
    description: "Configurez votre centre en moins de 10 minutes",
  },
];

export function PricingCTA() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold lg:text-5xl">Prêt à commencer ?</h2>
          <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl">
            Rejoignez des centaines de centres qui font déjà confiance à SaaS Formation pour gérer leurs espaces et
            optimiser leurs réservations.
          </p>

          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8 text-lg">
              <Link href="/auth/register">
                Commencer l'essai gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 text-lg">
              <Link href="/contact">Parler à un expert</Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 bg-white/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <benefit.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4 text-sm">Ils nous font déjà confiance :</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
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
