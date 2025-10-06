import { Building, Users, Calendar, MapPin, Star, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Building,
    value: "500+",
    label: "Centres partenaires",
    description: "Centres vérifiés et certifiés",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Users,
    value: "2,000+",
    label: "Spécialistes",
    description: "Formateurs qualifiés",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Calendar,
    value: "10,000+",
    label: "Formations",
    description: "Sessions organisées",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: MapPin,
    value: "24",
    label: "Gouvernorats",
    description: "Couverture nationale",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Satisfaction",
    description: "Note moyenne des utilisateurs",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: TrendingUp,
    value: "150%",
    label: "Croissance",
    description: "Croissance annuelle",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function AboutStats() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            SaaS Formation en chiffres
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'impact de notre plateforme sur l'écosystème 
            de formation en Tunisie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              
              {/* Value */}
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-xl font-semibold mb-2">
                {stat.label}
              </div>
              
              {/* Description */}
              <div className="text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Données mises à jour en temps réel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Croissance continue depuis 2023</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
