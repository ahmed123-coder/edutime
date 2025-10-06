"use client";

import Link from "next/link";
import { ArrowRight, Play, Star, Users, Building, Award } from "lucide-react";
import { IMAGES } from "@/lib/images";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="w-fit">
              🚀 Plateforme #1 en Tunisie
            </Badge>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Trouvez l'espace de{" "}
                <span className="text-primary">formation</span> parfait
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Réservez des salles de formation, connectez-vous avec des spécialistes qualifiés 
                et accédez aux meilleurs services partenaires en quelques clics.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-primary" />
                <span className="font-semibold">500+</span>
                <span className="text-muted-foreground">Centres</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">2000+</span>
                <span className="text-muted-foreground">Spécialistes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">Satisfaction</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/search">
                  Commencer la recherche
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Ils nous font confiance :
              </p>
              <div className="flex items-center space-x-8 opacity-60">
                {/* Placeholder for partner logos */}
                <div className="h-8 w-20 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={IMAGES.LANDING_HERO}
                alt="Espace de formation moderne"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Certifié</div>
                  <div className="text-xs text-muted-foreground">Qualité garantie</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="h-5 w-5 bg-primary rounded-full border-2 border-white" />
                  <div className="h-5 w-5 bg-secondary rounded-full border-2 border-white" />
                  <div className="h-5 w-5 bg-accent rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">+1000</div>
                  <div className="text-xs text-muted-foreground">Utilisateurs actifs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
