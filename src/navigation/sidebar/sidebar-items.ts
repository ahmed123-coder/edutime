import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
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

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Tableaux de bord",
    items: [
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Analytiques",
        url: "/dashboard/coming-soon",
        icon: Gauge,
        comingSoon: true,
      },
      {
        title: "E-commerce",
        url: "/dashboard/coming-soon",
        icon: ShoppingBag,
        comingSoon: true,
      },
      {
        title: "Académie",
        url: "/dashboard/coming-soon",
        icon: GraduationCap,
        comingSoon: true,
      },
      {
        title: "Logistique",
        url: "/dashboard/coming-soon",
        icon: Forklift,
        comingSoon: true,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Email",
        url: "/dashboard/coming-soon",
        icon: Mail,
        comingSoon: true,
      },
      {
        title: "Chat",
        url: "/dashboard/coming-soon",
        icon: MessageSquare,
        comingSoon: true,
      },
      {
        title: "Calendrier",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
      },
      {
        title: "Kanban",
        url: "/dashboard/coming-soon",
        icon: Kanban,
        comingSoon: true,
      },
      {
        title: "Facture",
        url: "/dashboard/coming-soon",
        icon: ReceiptText,
        comingSoon: true,
      },
      {
        title: "Utilisateurs",
        url: "/dashboard/coming-soon",
        icon: Users,
        comingSoon: true,
      },
      {
        title: "Rôles",
        url: "/dashboard/coming-soon",
        icon: Lock,
        comingSoon: true,
      },
      {
        title: "Authentification",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Connexion v1", url: "/auth/v1/login", newTab: true },
          { title: "Connexion v2", url: "/auth/v2/login", newTab: true },
          { title: "Inscription v1", url: "/auth/v1/register", newTab: true },
          { title: "Inscription v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Divers",
    items: [
      {
        title: "Autres",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];
