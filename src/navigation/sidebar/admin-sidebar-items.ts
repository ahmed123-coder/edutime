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
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "System Health",
        url: "/dashboard/admin/system",
        icon: Activity,
      },
    ],
  },
  {
    id: 2,
    label: "Management",
    items: [
      {
        title: "Users",
        url: "/dashboard/admin/users",
        icon: Users,
        subItems: [
          { title: "All Users", url: "/dashboard/admin/users" },
          { title: "Admins", url: "/dashboard/admin/users?role=ADMIN" },
          { title: "Center Owners", url: "/dashboard/admin/users?role=CENTER_OWNER" },
          { title: "Teachers", url: "/dashboard/admin/users?role=TEACHER" },
          { title: "Partners", url: "/dashboard/admin/users?role=PARTNER" },
        ],
      },
      {
        title: "Organizations",
        url: "/dashboard/admin/organizations",
        icon: Building2,
        subItems: [
          { title: "All Centers", url: "/dashboard/admin/organizations" },
          { title: "Pending Approval", url: "/dashboard/admin/organizations?status=pending" },
          { title: "Verified Centers", url: "/dashboard/admin/organizations?status=verified" },
        ],
      },
      {
        title: "Subscriptions",
        url: "/dashboard/admin/subscriptions",
        icon: Package,
        subItems: [
          { title: "All Subscriptions", url: "/dashboard/admin/subscriptions" },
          { title: "Packages", url: "/dashboard/admin/subscriptions?tab=packages" },
          { title: "Expiring Soon", url: "/dashboard/admin/subscriptions?status=expiring" },
        ],
      },
      {
        title: "Bookings",
        url: "/dashboard/admin/bookings",
        icon: Calendar,
        subItems: [
          { title: "All Bookings", url: "/dashboard/admin/bookings" },
          { title: "Pending", url: "/dashboard/admin/bookings?status=pending" },
          { title: "Confirmed", url: "/dashboard/admin/bookings?status=confirmed" },
          { title: "Disputes", url: "/dashboard/admin/bookings?status=dispute" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Financial",
    items: [
      {
        title: "Payments",
        url: "/dashboard/admin/payments",
        icon: CreditCard,
        subItems: [
          { title: "All Transactions", url: "/dashboard/admin/payments" },
          { title: "Commission Reports", url: "/dashboard/admin/payments/commissions" },
          { title: "Payouts", url: "/dashboard/admin/payments/payouts" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Content & Support",
    items: [
      {
        title: "Reviews",
        url: "/dashboard/admin/reviews",
        icon: MessageSquare,
        subItems: [
          { title: "All Reviews", url: "/dashboard/admin/reviews" },
          { title: "Flagged Reviews", url: "/dashboard/admin/reviews?flagged=true" },
        ],
      },
      {
        title: "Reports",
        url: "/dashboard/admin/reports",
        icon: FileText,
      },
    ],
  },
  {
    id: 5,
    label: "System",
    items: [
      {
        title: "Settings",
        url: "/dashboard/admin/settings",
        icon: Settings,
        subItems: [
          { title: "Platform Settings", url: "/dashboard/admin/settings/platform" },
          { title: "Payment Settings", url: "/dashboard/admin/settings/payments" },
          { title: "Email Templates", url: "/dashboard/admin/settings/emails" },
        ],
      },
      {
        title: "Security",
        url: "/dashboard/admin/security",
        icon: Shield,
      },
      {
        title: "Database",
        url: "/dashboard/admin/database",
        icon: Database,
        comingSoon: true,
      },
    ],
  },
];
