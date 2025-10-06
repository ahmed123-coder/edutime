import Link from "next/link";

import { Star, MapPin, Award, Clock, CheckCircle, Heart, Share, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock specialists data
const specialists = [
  {
    id: "1",
    name: "Ahmed Ben Salem",
    title: "Expert en Développement Web",
    speciality: "Développement Web",
    description: "Développeur full-stack avec 8 ans d'expérience. Spécialisé en React, Node.js et architectures cloud.",
    avatar: "/specialists/ahmed.jpg",
    rating: 4.9,
    reviewCount: 87,
    location: "Tunis",
    hourlyRate: 85,
    experience: "8 ans",
    verified: true,
    available: true,
    languages: ["Français", "Anglais", "Arabe"],
    certifications: ["AWS Certified", "Google Certified"],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    completedProjects: 156,
  },
  {
    id: "2",
    name: "Fatma Khelifi",
    title: "Consultante Marketing Digital",
    speciality: "Marketing Digital",
    description:
      "Experte en stratégies digitales et growth hacking. Accompagne les entreprises dans leur transformation digitale.",
    avatar: "/specialists/fatma.jpg",
    rating: 4.8,
    reviewCount: 124,
    location: "Sousse",
    hourlyRate: 75,
    experience: "6 ans",
    verified: true,
    available: false,
    languages: ["Français", "Anglais"],
    certifications: ["Google Ads", "Facebook Blueprint"],
    skills: ["SEO/SEA", "Social Media", "Analytics", "Content Marketing"],
    completedProjects: 89,
  },
  {
    id: "3",
    name: "Karim Mansouri",
    title: "Chef de Projet Agile",
    speciality: "Gestion de Projet",
    description: "Scrum Master certifié avec expertise en transformation agile et management d'équipes techniques.",
    avatar: "/specialists/karim.jpg",
    rating: 4.7,
    reviewCount: 156,
    location: "Sfax",
    hourlyRate: 95,
    experience: "10 ans",
    verified: true,
    available: true,
    languages: ["Français", "Anglais", "Arabe"],
    certifications: ["Scrum Master", "PMP"],
    skills: ["Scrum", "Kanban", "Leadership", "Coaching"],
    completedProjects: 203,
  },
  {
    id: "4",
    name: "Leila Trabelsi",
    title: "Designer UX/UI",
    speciality: "Design UX/UI",
    description: "Designer passionnée par l'expérience utilisateur. Créatrice d'interfaces intuitives et esthétiques.",
    avatar: "/specialists/leila.jpg",
    rating: 4.9,
    reviewCount: 67,
    location: "Tunis",
    hourlyRate: 70,
    experience: "5 ans",
    verified: false,
    available: true,
    languages: ["Français", "Anglais"],
    certifications: ["Adobe Certified"],
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    completedProjects: 78,
  },
];

export function SpecialistsList() {
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spécialistes disponibles</h2>
          <p className="text-muted-foreground">{specialists.length} spécialistes trouvés</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Trier par:</span>
          <select className="rounded border px-2 py-1 text-sm">
            <option>Pertinence</option>
            <option>Note</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
            <option>Expérience</option>
          </select>
        </div>
      </div>

      {/* Specialists Grid */}
      <div className="grid gap-6">
        {specialists.map((specialist) => (
          <Card key={specialist.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Avatar & Basic Info */}
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={specialist.avatar} alt={specialist.name} />
                    <AvatarFallback className="text-lg">
                      {specialist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{specialist.name}</h3>
                      {specialist.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      <div
                        className={`h-3 w-3 rounded-full ${specialist.available ? "bg-green-500" : "bg-gray-400"}`}
                      />

                    <p className="text-primary mb-2 font-medium">{specialist.title}</p>

                    <div className="text-muted-foreground mb-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span>({specialist.reviewCount} avis)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{specialist.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{specialist.experience} d'exp.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-muted-foreground mb-4 leading-relaxed">{specialist.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">Compétences principales:</h4>
                    <div className="flex flex-wrap gap-2">
                      {specialist.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {specialist.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{specialist.skills.length - 4} autres
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {specialist.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-green-200 bg-green-50 text-xs text-green-700"
                        >
                          <Award className="mr-1 h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">Langues:</h4>
                    <div className="flex space-x-2">
                      {specialist.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-muted-foreground mb-4 text-sm">
                    <strong>{specialist.completedProjects}</strong> projets réalisés
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="space-y-4 lg:w-48">
                  <div className="text-center lg:text-right">
                    <div className="text-primary flex items-center justify-center space-x-1 text-2xl font-bold lg:justify-end">
                      <DollarSign className="h-5 w-5" />
                      <span>{specialist.hourlyRate} DT</span>
                    </div>
                    <div className="text-muted-foreground text-sm">par heure</div>
                    <div className={`mt-1 text-xs ${specialist.available ? "text-green-600" : "text-gray-500"}`}>
                      {specialist.available ? "Disponible" : "Occupé"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href={`/specialists/${specialist.id}`}>Voir le profil</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!specialist.available}
                    >
                      Contacter
                    </Button>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Charger plus de spécialistes
        </Button>
      </div>
    </div>
  );
}
