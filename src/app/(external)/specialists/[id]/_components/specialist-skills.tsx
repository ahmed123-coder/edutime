import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SpecialistSkillsProps {
  specialist: {
    skills: Array<{
      name: string;
      level: number;
    }>;
  };
}

export function SpecialistSkills({ specialist }: SpecialistSkillsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Compétences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {specialist.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
