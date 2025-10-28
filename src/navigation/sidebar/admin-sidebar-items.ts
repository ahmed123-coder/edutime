import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  MessageSquare,
  FileText,
  Database,
  Activity,
  Package,
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

export const adminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Vue d'ensemble",
    items: [
      {
        title: "Tableau de bord",
        url: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytiques",
        url: "/dashboard/admin/analytics",
        icon: BarChart3,
        comingSoon: true,
      },
      {
        title: "État du système",
        url: "/dashboard/admin/system",
        icon: Activity,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Gestion",
    items: [
      {
        title: "Utilisateurs",
        url: "/dashboard/admin/users",
        icon: Users,
        subItems: [
          { title: "Tous les utilisateurs", url: "/dashboard/admin/users" },
          { title: "Administrateurs", url: "/dashboard/admin/users?role=ADMIN" },
          { title: "Propriétaires de centres", url: "/dashboard/admin/users?role=CENTER_OWNER" },
          { title: "Enseignants", url: "/dashboard/admin/users?role=TEACHER" },
          { title: "Partenaires", url: "/dashboard/admin/users?role=PARTNER" },
        ],
      },
      {
        title: "Organisations",
        url: "/dashboard/admin/organizations",
        icon: Building2,
        subItems: [
          { title: "Tous les centres", url: "/dashboard/admin/organizations" },
          { title: "En attente d'approbation", url: "/dashboard/admin/organizations?status=pending" },
          { title: "Centres vérifiés", url: "/dashboard/admin/organizations?status=verified" },
        ],
      },
      {
        title: "Abonnements",
        url: "/dashboard/admin/subscriptions",
        icon: Package,
        subItems: [
          { title: "Tous les abonnements", url: "/dashboard/admin/subscriptions" },
          { title: "Forfaits", url: "/dashboard/admin/subscriptions?tab=packages" },
          { title: "Expire bientôt", url: "/dashboard/admin/subscriptions?status=expiring" },
        ],
      },
      {
        title: "Réservations",
        url: "/dashboard/admin/bookings",
        icon: Calendar,
        subItems: [
          { title: "Toutes les réservations", url: "/dashboard/admin/bookings" },
          { title: "En attente", url: "/dashboard/admin/bookings?status=pending" },
          { title: "Confirmées", url: "/dashboard/admin/bookings?status=confirmed" },
          { title: "Litiges", url: "/dashboard/admin/bookings?status=dispute" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Financier",
    items: [
      {
        title: "Paiements",
        url: "/dashboard/admin/payments",
        icon: CreditCard,
        comingSoon: true,
        subItems: [
          { title: "Toutes les transactions", url: "/dashboard/admin/payments" },
          { title: "Rapports de commission", url: "/dashboard/admin/payments/commissions" },
          { title: "Versements", url: "/dashboard/admin/payments/payouts" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Contenu et support",
    items: [
      {
        title: "Avis",
        url: "/dashboard/admin/reviews",
        icon: MessageSquare,
        comingSoon: true,
        subItems: [
          { title: "Tous les avis", url: "/dashboard/admin/reviews" },
          { title: "Avis signalés", url: "/dashboard/admin/reviews?flagged=true" },
        ],
      },
      {
        title: "Rapports",
        url: "/dashboard/admin/reports",
        icon: FileText,
        comingSoon: true,
      },
    ],
  },
  {
    id: 5,
    label: "Système",
    items: [
      {
        title: "Paramètres",
        url: "/dashboard/admin/settings",
        icon: Settings,
        comingSoon: true,
        subItems: [
          { title: "Paramètres de plateforme", url: "/dashboard/admin/settings/platform" },
          { title: "Paramètres de paiement", url: "/dashboard/admin/settings/payments" },
          { title: "Modèles d'email", url: "/dashboard/admin/settings/emails" },
        ],
      },
      {
        title: "Sécurité",
        url: "/dashboard/admin/security",
        icon: Shield,
        comingSoon: true,
      },
      {
        title: "Base de données",
        url: "/dashboard/admin/database",
        icon: Database,
        comingSoon: true,
      },
    ],
  },
];
