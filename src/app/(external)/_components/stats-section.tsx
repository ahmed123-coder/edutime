import { Building, Users, Calendar, Star } from "lucide-react";

const stats = [
  {
    icon: Building,
    value: "500+",
    label: "Centres partenaires",
    description: "Centres de formation vérifiés",
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
    label: "Réservations",
    description: "Sessions organisées",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Satisfaction",
    description: "Note moyenne des utilisateurs",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Des chiffres qui parlent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme 
            pour leurs besoins en formation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              
              {/* Value */}
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-xl font-semibold mb-1">
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
              <span>Plateforme active 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Mises à jour en temps réel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Support client réactif</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
