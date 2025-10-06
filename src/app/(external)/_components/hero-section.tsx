"use client";

import Link from "next/link";

import { ArrowRight, Play, Star, Users, Building, Award } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/images";

export function HeroSection() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 relative overflow-hidden bg-gradient-to-br">
      {/* Background Pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />

      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="w-fit">
              🚀 Plateforme #1 en Tunisie
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                Trouvez l'espace de <span className="text-primary">formation</span> parfait
              </h1>
              <p className="text-muted-foreground max-w-lg text-xl">
                Réservez des salles de formation, connectez-vous avec des spécialistes qualifiés meilleurs services
                partenaires en quelques clics.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Building className="text-primary h-5 w-5" />
                <span className="font-semibold">500+</span>
                <span className="text-muted-foreground">Centres</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="text-primary h-5 w-5" />
                <span className="font-semibold">2000+</span>
                <span className="text-muted-foreground">Spécialistes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="text-primary h-5 w-5" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">Satisfaction</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="px-8 text-lg">
                <Link href="/search">
                  Commencer la recherche
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="border-t pt-8">
              <p className="text-muted-foreground mb-4 text-sm">Ils nous font confiance :</p>
              <div className="flex items-center space-x-8 opacity-60">
                {/* Placeholder for partner logos */}
                <div className="bg-muted h-8 w-20 rounded" />
                <div className="bg-muted h-8 w-20 rounded" />
                <div className="bg-muted h-8 w-20 rounded" />
                <div className="bg-muted h-8 w-20 rounded" />
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img src={IMAGES.LANDING_HERO} alt="Espace de formation moderne" className="h-auto w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute top-4 right-4 rounded-lg border bg-white/95 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Award className="text-primary h-4 w-4" />
                <div>
                  <div className="text-sm font-semibold">Certifié</div>
                  <div className="text-muted-foreground text-xs">Qualité garantie</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg border bg-white/95 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="bg-primary h-5 w-5 rounded-full border-2 border-white" />
                  <div className="bg-secondary h-5 w-5 rounded-full border-2 border-white" />
                  <div className="bg-accent h-5 w-5 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">+1000</div>
                  <div className="text-muted-foreground text-xs">Utilisateurs actifs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
