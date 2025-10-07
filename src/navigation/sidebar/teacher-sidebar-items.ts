import {
  LayoutDashboard,
  Search,
  MapPin,
  Calendar,
  CreditCard,
  Star,
  MessageSquare,
  User,
  Settings,
  BookOpen,
  Clock,
  Heart,
  FileText,
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

export const teacherSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Vue d'ensemble",
    items: [
      {
        title: "Tableau de bord",
        url: "/dashboard/teacher",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Rechercher et réserver",
    items: [
      {
        title: "Rechercher des centres",
        url: "/dashboard/teacher/search",
        icon: Search,
        subItems: [
          { title: "Vue carte", url: "/dashboard/teacher/search/map" },
          { title: "Vue liste", url: "/dashboard/teacher/search/list" },
          { title: "Recherches sauvegardées", url: "/dashboard/teacher/search/saved" },
        ],
      },
      {
        title: "Favoris",
        url: "/dashboard/teacher/favorites",
        icon: Heart,
        subItems: [
          { title: "Centres favoris", url: "/dashboard/teacher/favorites/centers" },
          { title: "Salles favorites", url: "/dashboard/teacher/favorites/rooms" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Mes réservations",
    items: [
      {
        title: "Réservations",
        url: "/dashboard/teacher/bookings",
        icon: Calendar,
        subItems: [
          { title: "À venir", url: "/dashboard/teacher/bookings?status=upcoming" },
          { title: "Réservations passées", url: "/dashboard/teacher/bookings?status=past" },
          { title: "Annulées", url: "/dashboard/teacher/bookings?status=cancelled" },
          { title: "Vue calendrier", url: "/dashboard/teacher/bookings/calendar" },
        ],
      },
      {
        title: "Réservation rapide",
        url: "/dashboard/teacher/quick-book",
        icon: Clock,
        isNew: true,
      },
    ],
  },
  {
    id: 4,
    label: "Enseignement",
    items: [
      {
        title: "Mes cours",
        url: "/dashboard/teacher/classes",
        icon: BookOpen,
        subItems: [
          { title: "Cours actuels", url: "/dashboard/teacher/classes/current" },
          { title: "Historique des cours", url: "/dashboard/teacher/classes/history" },
          { title: "Matériel de cours", url: "/dashboard/teacher/classes/materials" },
        ],
      },
      {
        title: "Étudiants",
        url: "/dashboard/teacher/students",
        icon: User,
        subItems: [
          { title: "Étudiants actuels", url: "/dashboard/teacher/students/current" },
          { title: "Progrès des étudiants", url: "/dashboard/teacher/students/progress" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Financier",
    items: [
      {
        title: "Paiements",
        url: "/dashboard/teacher/payments",
        icon: CreditCard,
        subItems: [
          { title: "Historique des paiements", url: "/dashboard/teacher/payments/history" },
          { title: "Paiements en attente", url: "/dashboard/teacher/payments/pending" },
          { title: "Méthodes de paiement", url: "/dashboard/teacher/payments/methods" },
        ],
      },
      {
        title: "Dépenses",
        url: "/dashboard/teacher/expenses",
        icon: FileText,
        subItems: [
          { title: "Dépenses de réservation", url: "/dashboard/teacher/expenses/bookings" },
          { title: "Documents fiscaux", url: "/dashboard/teacher/expenses/tax" },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Communauté",
    items: [
      {
        title: "Avis",
        url: "/dashboard/teacher/reviews",
        icon: Star,
        subItems: [
          { title: "Mes avis", url: "/dashboard/teacher/reviews/received" },
          { title: "Rédiger des avis", url: "/dashboard/teacher/reviews/write" },
        ],
      },
      {
        title: "Messages",
        url: "/dashboard/teacher/messages",
        icon: MessageSquare,
        subItems: [
          { title: "Propriétaires de centres", url: "/dashboard/teacher/messages/owners" },
          { title: "Support", url: "/dashboard/teacher/messages/support" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Compte",
    items: [
      {
        title: "Profil",
        url: "/dashboard/teacher/profile",
        icon: User,
        subItems: [
          { title: "Informations personnelles", url: "/dashboard/teacher/profile" },
          { title: "Diplômes d'enseignement", url: "/dashboard/teacher/profile/credentials" },
          { title: "Vérification", url: "/dashboard/teacher/profile/verification" },
        ],
      },
      {
        title: "Paramètres",
        url: "/dashboard/teacher/settings",
        icon: Settings,
        subItems: [
          { title: "Préférences", url: "/dashboard/teacher/settings/preferences" },
          { title: "Notifications", url: "/dashboard/teacher/settings/notifications" },
          { title: "Confidentialité", url: "/dashboard/teacher/settings/privacy" },
        ],
      },
    ],
  },
];
