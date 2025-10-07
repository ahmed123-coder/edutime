import {
  LayoutDashboard,
  Building2,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  MessageSquare,
  Star,
  FileText,
  Clock,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const ownerSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Vue d'ensemble",
    items: [
      {
        title: "Tableau de bord",
        url: "/dashboard/owner",
        icon: LayoutDashboard,
      },
      {
        title: "Analytiques",
        url: "/dashboard/owner/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    id: 2,
    label: "Mon centre",
    items: [
      {
        title: "Profil du centre",
        url: "/dashboard/owner/center",
        icon: Building2,
        subItems: [
          { title: "Informations de base", url: "/dashboard/owner/center" },
          { title: "Localisation et carte", url: "/dashboard/owner/center/location" },
          { title: "Photos et médias", url: "/dashboard/owner/center/media" },
          { title: "Équipements", url: "/dashboard/owner/center/amenities" },
        ],
      },
      {
        title: "Salles et espaces",
        url: "/dashboard/owner/rooms",
        icon: MapPin,
        subItems: [
          { title: "Toutes les salles", url: "/dashboard/owner/rooms" },
          { title: "Ajouter une nouvelle salle", url: "/dashboard/owner/rooms/new" },
          { title: "Types de salles", url: "/dashboard/owner/rooms/types" },
        ],
      },
      {
        title: "Disponibilité",
        url: "/dashboard/owner/availability",
        icon: Clock,
        subItems: [
          { title: "Planning", url: "/dashboard/owner/availability" },
          { title: "Dates bloquées", url: "/dashboard/owner/availability/blocked" },
          { title: "Horaires spéciaux", url: "/dashboard/owner/availability/special" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Réservations",
    items: [
      {
        title: "Réservations",
        url: "/dashboard/owner/bookings",
        icon: Calendar,
        subItems: [
          { title: "Toutes les réservations", url: "/dashboard/owner/bookings" },
          { title: "En attente d'approbation", url: "/dashboard/owner/bookings?status=pending" },
          { title: "Confirmées", url: "/dashboard/owner/bookings?status=confirmed" },
          { title: "Vue calendrier", url: "/dashboard/owner/bookings/calendar" },
        ],
      },
      {
        title: "Enseignants",
        url: "/dashboard/owner/teachers",
        icon: Users,
        subItems: [
          { title: "Enseignants réguliers", url: "/dashboard/owner/teachers" },
          { title: "Nouvelles demandes", url: "/dashboard/owner/teachers?status=new" },
          { title: "Enseignants bloqués", url: "/dashboard/owner/teachers?status=blocked" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Financier",
    items: [
      {
        title: "Revenus",
        url: "/dashboard/owner/earnings",
        icon: CreditCard,
        subItems: [
          { title: "Vue d'ensemble", url: "/dashboard/owner/earnings" },
          { title: "Historique des transactions", url: "/dashboard/owner/earnings/transactions" },
          { title: "Versements", url: "/dashboard/owner/earnings/payouts" },
          { title: "Rapports fiscaux", url: "/dashboard/owner/earnings/tax" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Réputation",
    items: [
      {
        title: "Avis",
        url: "/dashboard/owner/reviews",
        icon: Star,
        subItems: [
          { title: "Tous les avis", url: "/dashboard/owner/reviews" },
          { title: "Répondre aux avis", url: "/dashboard/owner/reviews/respond" },
        ],
      },
      {
        title: "Messages",
        url: "/dashboard/owner/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: 6,
    label: "Gestion",
    items: [
      {
        title: "Rapports",
        url: "/dashboard/owner/reports",
        icon: FileText,
        subItems: [
          { title: "Rapports de réservation", url: "/dashboard/owner/reports/bookings" },
          { title: "Rapports financiers", url: "/dashboard/owner/reports/financial" },
          { title: "Rapports de performance", url: "/dashboard/owner/reports/performance" },
        ],
      },
      {
        title: "Paramètres",
        url: "/dashboard/owner/settings",
        icon: Settings,
        subItems: [
          { title: "Paramètres de profil", url: "/dashboard/owner/settings/profile" },
          { title: "Paramètres de notification", url: "/dashboard/owner/settings/notifications" },
          { title: "Paramètres de tarification", url: "/dashboard/owner/settings/pricing" },
        ],
      },
    ],
  },
];
