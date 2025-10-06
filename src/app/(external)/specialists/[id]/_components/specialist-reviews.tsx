import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockReviews = [
  {
    id: "1",
    user: { name: "Mohamed Trabelsi", avatar: "/avatars/mohamed.jpg" },
    rating: 5,
    date: "2024-01-15",
    comment: "Excellente formatrice ! Très pédagogue et à l'écoute. La formation était parfaitement adaptée à nos besoins.",
  },
  {
    id: "2",
    user: { name: "Leila Mansouri", avatar: "/avatars/leila.jpg" },
    rating: 5,
    date: "2024-01-10",
    comment: "Formation de qualité avec des exemples concrets. Je recommande vivement !",
  },
];

interface SpecialistReviewsProps {
  specialistId: string;
}

export function SpecialistReviews({ specialistId }: SpecialistReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis clients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>
                  {review.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.user.name}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
