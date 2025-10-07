import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SpecialistContact } from "./_components/specialist-contact";
import { SpecialistHeader } from "./_components/specialist-header";
import { SpecialistProfile } from "./_components/specialist-profile";
import { SpecialistReviews } from "./_components/specialist-reviews";
import { SpecialistSkills } from "./_components/specialist-skills";

// Mock data
const mockSpecialist = {
  id: "1",
  name: "Dr. Sarah Ben Ahmed",
  title: "Formatrice Senior en Marketing Digital",
  speciality: "Marketing Digital & E-commerce",
  verified: true,
  rating: 4.9,
  reviewCount: 89,
  experience: 8,
  location: "Tunis",
  avatar: "/avatars/sarah.jpg",
  bio: "Experte en marketing digital avec plus de 8 ans d'expérience. Spécialisée dans les stratégies e-commerce, SEO/SEA et réseaux sociaux. Formatrice certifiée Google Ads et Facebook Blueprint.",
  skills: [
    { name: "Marketing Digital", level: 95 },
    { name: "SEO/SEA", level: 90 },
    { name: "Réseaux Sociaux", level: 88 },
    { name: "E-commerce", level: 92 },
    { name: "Google Ads", level: 94 },
    { name: "Analytics", level: 85 },
  ],
  certifications: ["Google Ads Certified", "Facebook Blueprint", "HubSpot Inbound Marketing", "Google Analytics IQ"],
  languages: ["Français", "Anglais", "Arabe"],
  hourlyRate: 120,
  availability: "Disponible",
  phone: "+216 98 123 456",
  email: "sarah.benahmed@email.com",
  linkedin: "linkedin.com/in/sarahbenahmed",
};

interface SpecialistPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: SpecialistPageProps): Promise<Metadata> {
  const { id } = await params;
  const specialist = mockSpecialist;

  if (!specialist) {
    return {
      title: "Spécialiste non trouvé",
    };
  }

  return {
    title: `${specialist.name} - ${specialist.title} | SaaS Formation`,
    description: specialist.bio,
    keywords: `${specialist.name}, ${specialist.speciality}, formateur, ${specialist.location}`,
  };
}

export default async function SpecialistPage({ params }: SpecialistPageProps) {
  const { id } = await params;
  const specialist = mockSpecialist;

  if (!specialist) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <SpecialistHeader specialist={specialist} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <SpecialistProfile specialist={specialist} />
            <SpecialistSkills specialist={specialist} />
            <SpecialistReviews specialistId={specialist.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SpecialistContact specialist={specialist} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
