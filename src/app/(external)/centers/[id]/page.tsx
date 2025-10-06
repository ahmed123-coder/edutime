import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CenterHeader } from "./_components/center-header";
import { CenterGallery } from "./_components/center-gallery";
import { CenterInfo } from "./_components/center-info";
import { CenterRooms } from "./_components/center-rooms";
import { CenterReviews } from "./_components/center-reviews";
import { CenterBooking } from "./_components/center-booking";

// Mock data - In real app, this would come from API
const mockCenter = {
  id: "1",
  name: "Excellence Training Center",
  slug: "excellence-training-center",
  description: "Centre de formation moderne avec équipements de pointe situé au cœur de Tunis. Nous offrons des espaces adaptés à tous types de formations professionnelles.",
  type: "TRAINING_CENTER",
  verified: true,
  rating: 4.8,
  reviewCount: 124,
  location: "Tunis Centre",
  address: "Avenue Habib Bourguiba, 1000 Tunis",
  coordinates: { lat: 36.8065, lng: 10.1815 },
  phone: "+216 71 123 456",
  email: "contact@excellencetraining.tn",
  website: "https://excellencetraining.tn",
  hours: {
    monday: { open: "08:00", close: "18:00" },
    tuesday: { open: "08:00", close: "18:00" },
    wednesday: { open: "08:00", close: "18:00" },
    thursday: { open: "08:00", close: "18:00" },
    friday: { open: "08:00", close: "18:00" },
    saturday: { open: "09:00", close: "16:00" },
    sunday: { closed: true },
  },
  amenities: [
    "WiFi haut débit",
    "Parking gratuit",
    "Café/Thé",
    "Projecteur HD",
    "Système audio",
    "Climatisation",
    "Sécurité 24/7",
    "Accès handicapés"
  ],
  images: [
    "/images/center1-1.jpg",
    "/images/center1-2.jpg",
    "/images/center1-3.jpg",
    "/images/center1-4.jpg",
  ],
  rooms: [
    {
      id: "r1",
      name: "Salle Alpha",
      description: "Salle moderne parfaite pour formations en petit groupe",
      capacity: 25,
      area: 45,
      hourlyRate: 80,
      equipment: ["Projecteur", "Tableau blanc", "WiFi", "Climatisation"],
      photos: ["/images/room1-1.jpg", "/images/room1-2.jpg"],
      available: true,
    },
    {
      id: "r2",
      name: "Salle Beta",
      description: "Grande salle pour conférences et séminaires",
      capacity: 50,
      area: 80,
      hourlyRate: 120,
      equipment: ["Projecteur", "Système audio", "Microphones", "Éclairage LED"],
      photos: ["/images/room2-1.jpg", "/images/room2-2.jpg"],
      available: true,
    },
    {
      id: "r3",
      name: "Salle Gamma",
      description: "Espace intime pour formations spécialisées",
      capacity: 15,
      area: 30,
      hourlyRate: 60,
      equipment: ["Écran TV", "Tableau blanc", "WiFi"],
      photos: ["/images/room3-1.jpg"],
      available: false,
    },
  ],
};

interface CenterPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CenterPageProps): Promise<Metadata> {
  // In real app, fetch center data
  const center = mockCenter;
  
  if (!center) {
    return {
      title: "Centre non trouvé",
    };
  }

  return {
    title: `${center.name} | SaaS Formation`,
    description: center.description,
    keywords: `${center.name}, centre formation, ${center.location}, réservation salle`,
    openGraph: {
      title: center.name,
      description: center.description,
      type: "website",
      locale: "fr_TN",
      siteName: "SaaS Formation",
      url: `/centers/${center.id}`,
    },
  };
}

export default function CenterPage({ params }: CenterPageProps) {
  // In real app, fetch center data based on params.id
  const center = mockCenter;

  if (!center) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <CenterHeader center={center} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CenterGallery images={center.images} />
            <CenterInfo center={center} />
            <CenterRooms rooms={center.rooms} />
            <CenterReviews centerId={center.id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CenterBooking center={center} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
