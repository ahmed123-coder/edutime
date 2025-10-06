import { Check } from "lucide-react";

export function PricingHero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          Tarifs transparents
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choisissez le plan qui correspond à vos besoins. 
          Tous nos plans incluent un essai gratuit de 30 jours.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Essai gratuit 30 jours</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Sans engagement</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Support inclus</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Annulation à tout moment</span>
          </div>
        </div>
      </div>
    </section>
  );
}
