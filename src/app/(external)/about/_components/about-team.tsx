import { Linkedin, Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const team = [
  {
    name: "Ahmed Ben Ali",
    role: "CEO & Fondateur",
    bio: "Expert en technologie éducative avec 10 ans d'expérience dans le développement de solutions SaaS.",
    avatar: "/avatars/ahmed.jpg",
    linkedin: "linkedin.com/in/ahmedbenali",
    email: "ahmed@saasformation.tn",
  },
  {
    name: "Fatma Khelifi",
    role: "CTO",
    bio: "Ingénieure logiciel passionnée par l'innovation et l'architecture de systèmes distribués.",
    avatar: "/avatars/fatma.jpg",
    linkedin: "linkedin.com/in/fatmakhelifi",
    email: "fatma@saasformation.tn",
  },
  {
    name: "Karim Mansouri",
    role: "Directeur Commercial",
    bio: "Spécialiste en développement commercial avec une expertise dans le secteur de la formation.",
    avatar: "/avatars/karim.jpg",
    linkedin: "linkedin.com/in/karimmansouri",
    email: "karim@saasformation.tn",
  },
  {
    name: "Leila Trabelsi",
    role: "Responsable Marketing",
    bio: "Experte en marketing digital et stratégies de croissance pour les plateformes B2B.",
    avatar: "/avatars/leila.jpg",
    linkedin: "linkedin.com/in/leilatrabelsi",
    email: "leila@saasformation.tn",
  },
];

export function AboutTeam() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Notre équipe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rencontrez les personnes passionnées qui travaillent chaque jour 
            pour améliorer votre expérience sur SaaS Formation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <div className="flex justify-center space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a 
                      href={`https://${member.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Rejoignez notre équipe</h3>
              <p className="text-muted-foreground mb-6">
                Nous sommes toujours à la recherche de talents passionnés 
                pour nous aider à révolutionner le secteur de la formation.
              </p>
              <Button>
                Voir nos offres d'emploi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
