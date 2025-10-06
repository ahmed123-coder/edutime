"use client";

import { useState } from "react";

import { Star, ThumbsUp, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock reviews data
const reviews = [
  {
    id: "1",
    user: {
      name: "Sarah Ben Ahmed",
      avatar: "/avatars/sarah.jpg",
      company: "StartupTech",
    },
    rating: 5,
    date: "2024-01-15",
    service: "Formation React & Next.js",
    comment:
      "Excellente formation ! L'équipe de TechConseil Pro maîtrise parfaitement le sujet. Les exercices pratiques étaient très pertinents et nous avons pu appliquer directement les concepts dans nos projets.",
    helpful: 12,
    response: {
      date: "2024-01-16",
      text: "Merci Sarah pour ce retour positif ! Nous sommes ravis que la formation ait répondu à vos attentes. N'hésitez pas à nous contacter pour le suivi post-formation.",
    },
  },
  {
    id: "2",
    user: {
      name: "Mohamed Trabelsi",
      avatar: "/avatars/mohamed.jpg",
      company: "InnovCorp",
    },
    rating: 4,
    date: "2024-01-10",
    service: "Audit Sécurité IT",
    comment:
      "Audit très complet et professionnel. Le rapport était détaillé avec des recommandations claires. Seul bémol : le délai de livraison un peu plus long que prévu.",
    helpful: 8,
    response: {
      date: "2024-01-11",
      text: "Merci Mohamed. Nous prenons note de votre remarque sur les délais et travaillons à optimiser nos processus pour les prochaines missions.",
    },
  },
  {
    id: "3",
    user: {
      name: "Leila Mansouri",
      avatar: "/avatars/leila.jpg",
      company: "DigitalSolutions",
    },
    rating: 5,
    date: "2024-01-05",
    service: "Transformation Digitale",
    comment:
      "Accompagnement exceptionnel ! L'équipe a su comprendre nos enjeux et proposer une stratégie adaptée. Les résultats sont déjà visibles après 3 mois.",
    helpful: 15,
  },
];

const ratingDistribution = [
  { stars: 5, count: 89, percentage: 57 },
  { stars: 4, count: 45, percentage: 29 },
  { stars: 3, count: 15, percentage: 10 },
  { stars: 2, count: 5, percentage: 3 },
  { stars: 1, count: 2, percentage: 1 },
];

interface PartnerReviewsProps {
  partnerId: string;
}

export function PartnerReviews({ partnerId }: PartnerReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

  const averageRating = 4.8;
  const totalReviews = 156;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis clients</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rating Summary */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold">{averageRating}</div>
            <div className="mb-2 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= averageRating ? "fill-current text-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div className="text-muted-foreground">Basé sur {totalReviews} avis</div>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center space-x-3">
                <div className="flex w-12 items-center space-x-1">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                </div>
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-muted-foreground w-8 text-sm">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>
                    {review.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{review.user.name}</div>
                      <div className="text-muted-foreground text-sm">{review.user.company}</div>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(review.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="mb-2 flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "fill-current text-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">• {review.service}</span>
                  </div>

                  <p className="text-muted-foreground mb-3 leading-relaxed">{review.comment}</p>

                  <div className="mb-3 flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Utile ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Répondre
                    </Button>
                  </div>

                  {/* Partner Response */}
                  {review.response && (
                    <div className="bg-muted/50 mt-3 rounded-lg p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-sm font-medium">Réponse de TechConseil Pro</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(review.response.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{review.response.text}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {reviews.length > 2 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Voir moins d'avis" : `Voir tous les avis (${reviews.length})`}
            </Button>
          </div>
        )}

        {/* Write Review CTA */}
        <div className="bg-muted/50 mt-8 rounded-lg p-6 text-center">
          <h3 className="mb-2 font-semibold">Vous avez travaillé avec ce partenaire ?</h3>
          <p className="text-muted-foreground mb-4">Partagez votre expérience pour aider d'autres utilisateurs.</p>
          <Button>Écrire un avis</Button>
        </div>
      </CardContent>
    </Card>
  );
}
