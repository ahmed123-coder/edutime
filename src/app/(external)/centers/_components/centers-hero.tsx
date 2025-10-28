import { Building, MapPin, Star } from "lucide-react";

export function CentersHero() {
  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Centres de formation</h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
          Découvrez notre réseau de centres partenaires vérifiés et trouvez l'espace idéal pour vos formations.
        </p>

        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Building className="text-primary h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">500+</div>
            <div className="text-muted-foreground">Centres partenaires</div>
          </div>

          <div className="text-center">
            <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MapPin className="text-secondary h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">24</div>
            <div className="text-muted-foreground">Gouvernorats couverts</div>
          </div>

          <div className="text-center">
            <div className="bg-accent/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Star className="text-accent h-8 w-8" />
            </div>
            <div className="mb-2 text-3xl font-bold">4.9/5</div>
            <div className="text-muted-foreground">Note moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}
