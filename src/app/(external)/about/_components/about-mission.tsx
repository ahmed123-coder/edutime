import { Card, CardContent } from "@/components/ui/card";

export function AboutMission() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Notre histoire</h2>
            <p className="text-muted-foreground text-lg">
              Découvrez comment SaaS Formation est devenue la plateforme de référence pour la gestion d'espaces de
              formation en Tunisie.
            </p>
          </div>

          <div className="space-y-12">
            {/* Story Timeline */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-2xl font-bold">Le problème identifié</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  En 2023, nous avons constaté que les formateurs et centres de formation en Tunisie faisaient face à
                  des défis majeurs : difficulté à trouver des espaces adaptés, processus de réservation complexes, et
                  manque de visibilité pour les centres.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  C'est de ce constat qu'est née l'idée de créer une plateforme centralisée, moderne et accessible à
                  tous les acteurs de la formation professionnelle.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <div className="text-primary mb-2 text-4xl font-bold">2023</div>
                <div className="text-muted-foreground">Année de création</div>
              </div>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="bg-muted/30 order-2 rounded-lg p-8 text-center lg:order-1">
                <div className="text-primary mb-2 text-4xl font-bold">500+</div>
                <div className="text-muted-foreground">Centres partenaires</div>
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="mb-4 text-2xl font-bold">La solution innovante</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Nous avons développé une plateforme intuitive qui permet aux formateurs de trouver et réserver des
                  espaces en quelques clics, tout en offrant aux centres une visibilité maximale et des outils de
                  gestion modernes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Aujourd'hui, plus de 500 centres nous font confiance et des milliers de formations sont organisées
                  chaque mois via notre plateforme.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="from-primary/5 to-secondary/5 mt-16 border-0 bg-gradient-to-br">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Notre engagement</h3>
              <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
                Nous nous engageons à continuer d'innover pour offrir la meilleure expérience utilisateurs, tout en
                contribuant au développement de l'écosystème de formation en Tunisie et au-delà.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
