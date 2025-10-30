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
  Gift,
  Bell,
  Wrench,
  Sofa,
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
        title: "Disponibilité",
        url: "/dashboard/owner/availability",
        icon: Clock,
     
      },
    ],
  },
  {
    id: 2,
    label: "Alertes",
    items: [
      {
        title: "Notifications",
        url: "/dashboard/owner/notifications",
        icon: Bell,
      },
    ],
  },
  {
    id: 3,
    label: "Organisations",
    items: [
      {
        title: "Profil d'organisations",
        url: "/dashboard/owner/center",
        icon: Building2,
        subItems: [
          { title: "informations générales", url: "/dashboard/owner/organizations" },
          { title: "Localisation et carte", url: "/dashboard/owner/center/location" },
          { title: "Équipements", url: "/dashboard/owner/center/amenities" },
        ],
      },
      {
        title: "Salles et espaces",
        url: "/dashboard/owner/rooms",
        icon: MapPin,
      },
      {
        title: "Équipements",
        url: "/dashboard/owner/equipment",
        icon: Wrench,
      },
      {
        title: "Commodités",
        url: "/dashboard/owner/amenities",
        icon: Sofa,
      },
  
    ],
  },
  {
    id: 4,
    label: "Réservations",
    items: [
      {
        title: "Réservations",
        url: "/dashboard/owner/bookings",
        icon: Calendar,
      
      },
      {
        title: "Enseignants",
        url: "/dashboard/owner/teachers",
        icon: Users,
       
      },
    ],
  },
  {
    id: 5,
    label: "Financier",
    items: [
      {
        title: "Revenus",
        url: "/dashboard/owner/earnings",
        icon: CreditCard,
     
      },
    ],
  },
  {
    id: 6,
    items: [
 
      {
        title: "Paramètres",
        url: "/dashboard/owner/settings",
        icon: Settings,
        
      },
      
     
    ],
  },
];
