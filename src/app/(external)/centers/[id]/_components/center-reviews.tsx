"use client";

import { useState } from "react";

import { Star, ThumbsUp, Flag, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Sarah Ben Ahmed",
      avatar: "/avatars/sarah.jpg",
      verified: true,
    },
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent centre de formation ! Les salles sont modernes, bien équipées et le personnel est très professionnel. J'ai organisé plusieurs formations ici et mes participants sont toujours satisfaits.",
    helpful: 12,
    response: {
      author: "Excellence Training Center",
      date: "2024-01-16",
      content:
        "Merci beaucoup Sarah pour ce retour positif ! Nous sommes ravis que nos installations répondent à vos attentes.",
    },
  },
  {
    id: "2",
    user: {
      name: "Mohamed Trabelsi",
      avatar: "/avatars/mohamed.jpg",
      verified: false,
    },
    rating: 4,
    date: "2024-01-10",
    comment:
      "Très bon centre, salles spacieuses et bien climatisées. Le parking est un vrai plus. Seul bémol : le café pourrait être de meilleure qualité.",
    helpful: 8,
  },
  {
    id: "3",
    user: {
      name: "Leila Mansouri",
      avatar: "/avatars/leila.jpg",
      verified: true,
    },
    rating: 5,
    date: "2024-01-05",
    comment:
      "Parfait pour mes formations en entreprise. L'équipement audiovisuel est de qualité et la réservation en ligne est très pratique.",
    helpful: 15,
  },
];

const ratingDistribution = [
  { stars: 5, count: 78, percentage: 63 },
  { stars: 4, count: 31, percentage: 25 },
  { stars: 3, count: 10, percentage: 8 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 2, percentage: 2 },
];

interface CenterReviewsProps {
  centerId: string;
}

export function CenterReviews({ centerId }: CenterReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);
  const totalReviews = 124;
  const averageRating = 4.8;

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Avis et évaluations</h2>

      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">{averageRating}</div>
              <div className="mb-2 flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Basé sur {totalReviews} avis</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center space-x-3">
                  <div className="flex w-12 items-center space-x-1">
                    <span className="text-sm">{rating.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1" />
                  <span className="text-muted-foreground w-8 text-sm">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                    <AvatarFallback>
                      {review.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user.name}</span>
                      {review.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              {/* Review Content */}
              <p className="text-muted-foreground mb-4 leading-relaxed">{review.comment}</p>

              {/* Review Actions */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHelpful(review.id)}
                  className={helpfulVotes[review.id] ? "text-primary" : ""}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Utile ({review.helpful + (helpfulVotes[review.id] ? 1 : 0)})
                </Button>
              </div>

              {/* Center Response */}
              {review.response && (
                <div className="bg-muted/50 mt-4 rounded-lg p-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <span className="text-sm font-medium">{review.response.author}</span>
                    <Badge variant="outline" className="text-xs">
                      Propriétaire
                    </Badge>
                    <span className="text-muted-foreground text-xs">{formatDate(review.response.date)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.response.content}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {!showAllReviews && mockReviews.length > 3 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAllReviews(true)}>
            <ChevronDown className="mr-2 h-4 w-4" />
            Voir tous les avis ({totalReviews})
          </Button>
        </div>
      )}

      {/* Write Review CTA */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="mb-2 font-semibold">Partagez votre expérience</h3>
          <p className="text-muted-foreground mb-4">
            Aidez les autres utilisateurs en partageant votre avis sur ce centre.
          </p>
          <Button>Écrire un avis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
