import { Users, Award, Star } from "lucide-react";

export function SpecialistsHero() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Nos spécialistes</h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
          Découvrez notre réseau d'experts et formateurs qualifiés, prêts à partager leur expertise avec vous.
        </p>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Users className="text-primary h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">2,000+</div>
            <div className="text-muted-foreground">Spécialistes actifs</div>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Award className="text-secondary h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">95%</div>
            <div className="text-muted-foreground">Certifiés</div>
          </div>

          <div className="text-center">
            <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Star className="text-accent h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">4.8/5</div>
            <div className="text-muted-foreground">Satisfaction moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}
