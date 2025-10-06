import { Shield, Heart, Zap, Users, Award, Globe } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Confiance",
    description: "Nous vérifions tous nos partenaires et garantissons la sécurité de vos transactions.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Nous sommes passionnés par l'éducation et l'innovation technologique.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous développons constamment de nouvelles fonctionnalités pour améliorer votre expérience.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Nous croyons en la force de la collaboration entre tous les acteurs de la formation.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous visons l'excellence dans tout ce que nous faisons, de nos services à notre support client.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Globe,
    title: "Accessibilité",
    description: "Nous rendons la formation accessible à tous, partout en Tunisie.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function AboutValues() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Nos valeurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ces valeurs guident chacune de nos décisions et façonnent 
            notre approche dans le développement de notre plateforme.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full ${value.bgColor} flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className={`h-8 w-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
