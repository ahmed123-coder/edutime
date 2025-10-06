import Link from "next/link";
import { Star, MapPin, Award, Clock, CheckCircle, Heart, Share, DollarSign } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    description: "Experte en stratégies digitales et growth hacking. Accompagne les entreprises dans leur transformation digitale.",
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
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <select className="text-sm border rounded px-2 py-1">
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
          <Card key={specialist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-start space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={specialist.avatar} alt={specialist.name} />
                    <AvatarFallback className="text-lg">
                      {specialist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-semibold">{specialist.name}</h3>
                      {specialist.verified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                      <div className={`w-3 h-3 rounded-full ${specialist.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    
                    <p className="text-primary font-medium mb-2">{specialist.title}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
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
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {specialist.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Compétences principales:</h4>
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
                    <h4 className="text-sm font-medium mb-2">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {specialist.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Langues:</h4>
                    <div className="flex space-x-2">
                      {specialist.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-sm text-muted-foreground mb-4">
                    <strong>{specialist.completedProjects}</strong> projets réalisés
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="lg:w-48 space-y-4">
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end space-x-1 text-2xl font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      <span>{specialist.hourlyRate} DT</span>
                    </div>
                    <div className="text-sm text-muted-foreground">par heure</div>
                    <div className={`text-xs mt-1 ${specialist.available ? 'text-green-600' : 'text-gray-500'}`}>
                      {specialist.available ? 'Disponible' : 'Occupé'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href={`/specialists/${specialist.id}`}>
                        Voir le profil
                      </Link>
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
