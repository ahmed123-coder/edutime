import { Award, Globe, Languages } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpecialistProfileProps {
  specialist: {
    bio: string;
    certifications: string[];
    languages: string[];
  };
}

export function SpecialistProfile({ specialist }: SpecialistProfileProps) {
  return (
    <div className="space-y-6">
      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>À propos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {specialist.bio}
          </p>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {specialist.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {cert}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Langues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {specialist.languages.map((language, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {language}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
