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
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Des chiffres qui parlent</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme pour leurs besoins en formation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              {/* Icon */}
              <div
                className={`h-16 w-16 rounded-full ${stat.bgColor} mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>

              {/* Value */}
              <div className="mb-2 text-4xl font-bold lg:text-5xl">{stat.value}</div>

              {/* Label */}
              <div className="mb-1 text-xl font-semibold">{stat.label}</div>

              {/* Description */}
              <div className="text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="text-muted-foreground inline-flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span>Plateforme active 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span>Mises à jour en temps réel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
              <span>Support client réactif</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
