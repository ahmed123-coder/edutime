import { Metadata } from "next";

import { PartnerContact } from "./_components/partner-contact";
import { PartnerHeader } from "./_components/partner-header";
import { PartnerReviews } from "./_components/partner-reviews";
import { PartnerServices } from "./_components/partner-services";

// Mock data - in real app, this would come from database
const mockPartner = {
  id: "1",
  name: "TechConseil Pro",
  type: "PARTNER_SERVICE",
  description: "Spécialiste en conseil et formation technologique pour entreprises",
  logo: "/partners/techconseil.jpg",
  verified: true,
  rating: 4.8,
  reviewCount: 156,
  location: "Tunis, Tunisie",
  founded: 2018,
  employees: "10-50",
  website: "www.techconseil.tn",
  phone: "+216 71 234 567",
  email: "contact@techconseil.tn",
  specialties: ["Formation IT", "Conseil Digital", "Transformation Numérique"],
  certifications: ["ISO 9001", "Microsoft Partner", "Google Partner"],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${mockPartner.name} | SaaS Formation`,
    description: `Découvrez les services de ${mockPartner.name} - ${mockPartner.description}`,
    keywords: `${mockPartner.name}, partenaire, services, formation, ${mockPartner.specialties.join(", ")}`,
  };
}

export default function PartnerPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <PartnerHeader partner={mockPartner} />
            <PartnerServices partnerId={mockPartner.id} />
            <PartnerReviews partnerId={mockPartner.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PartnerContact partner={mockPartner} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
