import { Target, Users, Lightbulb } from "lucide-react";

export function AboutHero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            SaaS Formation est née d'une vision simple : démocratiser l'accès aux espaces de formation 
            de qualité en Tunisie et faciliter la mise en relation entre formateurs, centres et apprenants.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
              <p className="text-muted-foreground">
                Connecter les acteurs de la formation pour créer un écosystème dynamique et accessible.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notre Équipe</h3>
              <p className="text-muted-foreground">
                Des experts passionnés par l'éducation et la technologie, unis pour votre réussite.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notre Vision</h3>
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
