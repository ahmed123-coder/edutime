import { Target, Users, Lightbulb } from "lucide-react";

export function AboutHero() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-6xl">Qui sommes-nous ?</h1>
          <p className="text-muted-foreground mb-12 text-xl leading-relaxed">
            SaaS Formation est née d'une vision simple : démocratiser l'accès aux espaces de formation de qualité en
            Tunisie et faciliter la mise en relation entre formateurs, centres et apprenants.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Notre Mission</h3>
              <p className="text-muted-foreground">
                Connecter les acteurs de la formation pour créer un écosystème dynamique et accessible.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Users className="text-secondary h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Notre Équipe</h3>
              <p className="text-muted-foreground">
                Des experts passionnés par l'éducation et la technologie, unis pour votre réussite.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Lightbulb className="text-accent h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Notre Vision</h3>
              <p className="text-muted-foreground">
                Devenir la référence en matière de gestion d'espaces de formation en Afrique du Nord.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
