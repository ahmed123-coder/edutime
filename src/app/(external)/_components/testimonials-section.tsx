"use client";

import { useState } from "react";

import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES } from "@/lib/images";

const testimonials = [
  {
    id: 1,
    name: "Sarah Ben Ahmed",
    role: "Formatrice en Marketing Digital",
    company: "Digital Academy",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "Cette plateforme a révolutionné ma façon de trouver des espaces de formation. La réservation est simple et les centres sont tous de qualité exceptionnelle.",
  },
  {
    id: 2,
    name: "Mohamed Trabelsi",
    role: "Directeur de Centre",
    company: "Excellence Training Center",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "Grâce à cette solution, nous avons augmenté notre taux d'occupation de 40%. L'interface est intuitive et le support client est remarquable.",
  },
  {
    id: 3,
    name: "Leila Mansouri",
    role: "Consultante RH",
    company: "HR Solutions",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "Je recommande vivement cette plateforme. Elle m'a fait gagner un temps précieux dans l'organisation de mes formations d'entreprise.",
  },
  {
    id: 4,
    name: "Ahmed Khelifi",
    role: "Formateur IT",
    company: "Tech Institute",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "La géolocalisation et les filtres avancés m'aident à trouver exactement ce dont j'ai besoin. Une solution vraiment bien pensée.",
  },
  {
    id: 5,
    name: "Fatma Bouazizi",
    role: "Responsable Formation",
    company: "Corporate Learning",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "L'intégration des paiements sécurisés et la gestion des réservations en temps réel font de cette plateforme un outil indispensable.",
  },
  {
    id: 6,
    name: "Karim Jebali",
    role: "Entrepreneur",
    company: "StartUp Hub",
    avatar: IMAGES.AVATARS.DEFAULT,
    rating: 5,
    content:
      "Pour nos événements et formations, nous ne cherchons plus ailleurs. La qualité des espaces et la facilité de réservation sont incomparables.",
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
    (currentIndex + 1) * testimonialsPerPage,
  );

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Ce que disent nos utilisateurs</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Découvrez les témoignages de formateurs, centres et entreprises qui utilisent notre plateforme au quotidien.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="text-primary/20 mb-4 h-8 w-8" />

                  {/* Rating */}
                  <div className="mb-4 flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                      <div className="text-primary text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={prevTestimonials} disabled={currentIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${i === currentIndex ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextTestimonials} disabled={currentIndex === totalPages - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="text-muted-foreground inline-flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>Note moyenne de 4.9/5 basée sur plus de 1,000 avis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
