import { Card, CardContent } from "@/components/ui/card";

export function AboutMission() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Notre histoire
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez comment SaaS Formation est devenue la plateforme de référence 
              pour la gestion d'espaces de formation en Tunisie.
            </p>
          </div>

          <div className="space-y-12">
            {/* Story Timeline */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Le problème identifié</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  En 2023, nous avons constaté que les formateurs et centres de formation 
                  en Tunisie faisaient face à des défis majeurs : difficulté à trouver des espaces 
                  adaptés, processus de réservation complexes, et manque de visibilité pour les centres.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  C'est de ce constat qu'est née l'idée de créer une plateforme centralisée, 
                  moderne et accessible à tous les acteurs de la formation professionnelle.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2023</div>
                <div className="text-muted-foreground">Année de création</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-muted/30 rounded-lg p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Centres partenaires</div>
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-2xl font-bold mb-4">La solution innovante</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous avons développé une plateforme intuitive qui permet aux formateurs 
                  de trouver et réserver des espaces en quelques clics, tout en offrant 
                  aux centres une visibilité maximale et des outils de gestion modernes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Aujourd'hui, plus de 500 centres nous font confiance et des milliers 
                  de formations sont organisées chaque mois via notre plateforme.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="mt-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Notre engagement</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Nous nous engageons à continuer d'innover pour offrir la meilleure expérience 
                possible à nos utilisateurs, tout en contribuant au développement de l'écosystème 
                de formation en Tunisie et au-delà.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
