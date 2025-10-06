"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { IMAGES } from "@/lib/images";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Sarah Ben Ahmed",
    role: "Formatrice en Marketing Digital",
    company: "Digital Academy",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "Cette plateforme a révolutionné ma façon de trouver des espaces de formation. La réservation est simple et les centres sont tous de qualité exceptionnelle.",
  },
  {
    id: 2,
    name: "Mohamed Trabelsi",
    role: "Directeur de Centre",
    company: "Excellence Training Center",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "Grâce à cette solution, nous avons augmenté notre taux d'occupation de 40%. L'interface est intuitive et le support client est remarquable.",
  },
  {
    id: 3,
    name: "Leila Mansouri",
    role: "Consultante RH",
    company: "HR Solutions",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "Je recommande vivement cette plateforme. Elle m'a fait gagner un temps précieux dans l'organisation de mes formations d'entreprise.",
  },
  {
    id: 4,
    name: "Ahmed Khelifi",
    role: "Formateur IT",
    company: "Tech Institute",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "La géolocalisation et les filtres avancés m'aident à trouver exactement ce dont j'ai besoin. Une solution vraiment bien pensée.",
  },
  {
    id: 5,
    name: "Fatma Bouazizi",
    role: "Responsable Formation",
    company: "Corporate Learning",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "L'intégration des paiements sécurisés et la gestion des réservations en temps réel font de cette plateforme un outil indispensable.",
  },
  {
    id: 6,
    name: "Karim Jebali",
    role: "Entrepreneur",
    company: "StartUp Hub",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content: "Pour nos événements et formations, nous ne cherchons plus ailleurs. La qualité des espaces et la facilité de réservation sont incomparables.",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const nextTestimonials = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  );

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de formateurs, centres et entreprises 
            qui utilisent notre plateforme au quotidien.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-primary">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonials}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonials}
              disabled={currentIndex === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Note moyenne de 4.9/5 basée sur plus de 1,000 avis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
