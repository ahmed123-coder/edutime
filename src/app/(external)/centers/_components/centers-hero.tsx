import { Building, MapPin, Star } from "lucide-react";

export function CentersHero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Centres de formation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Découvrez notre réseau de centres partenaires vérifiés et trouvez 
          l'espace idéal pour vos formations.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-muted-foreground">Centres partenaires</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-secondary" />
            </div>
            <div className="text-3xl font-bold mb-2">24</div>
            <div className="text-muted-foreground">Gouvernorats couverts</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-accent" />
            </div>
            <div className="text-3xl font-bold mb-2">4.9/5</div>
            <div className="text-muted-foreground">Note moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}
