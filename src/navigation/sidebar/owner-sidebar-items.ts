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
  Camera,
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
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/owner",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/dashboard/owner/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    id: 2,
    label: "My Center",
    items: [
      {
        title: "Center Profile",
        url: "/dashboard/owner/center",
        icon: Building2,
        subItems: [
          { title: "Basic Info", url: "/dashboard/owner/center" },
          { title: "Location & Map", url: "/dashboard/owner/center/location" },
          { title: "Photos & Media", url: "/dashboard/owner/center/media" },
          { title: "Amenities", url: "/dashboard/owner/center/amenities" },
        ],
      },
      {
        title: "Rooms & Spaces",
        url: "/dashboard/owner/rooms",
        icon: MapPin,
        subItems: [
          { title: "All Rooms", url: "/dashboard/owner/rooms" },
          { title: "Add New Room", url: "/dashboard/owner/rooms/new" },
          { title: "Room Types", url: "/dashboard/owner/rooms/types" },
        ],
      },
      {
        title: "Availability",
        url: "/dashboard/owner/availability",
        icon: Clock,
        subItems: [
          { title: "Schedule", url: "/dashboard/owner/availability" },
          { title: "Blocked Dates", url: "/dashboard/owner/availability/blocked" },
          { title: "Special Hours", url: "/dashboard/owner/availability/special" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Bookings",
    items: [
      {
        title: "Bookings",
        url: "/dashboard/owner/bookings",
        icon: Calendar,
        subItems: [
          { title: "All Bookings", url: "/dashboard/owner/bookings" },
          { title: "Pending Approval", url: "/dashboard/owner/bookings?status=pending" },
          { title: "Confirmed", url: "/dashboard/owner/bookings?status=confirmed" },
          { title: "Calendar View", url: "/dashboard/owner/bookings/calendar" },
        ],
      },
      {
        title: "Teachers",
        url: "/dashboard/owner/teachers",
        icon: Users,
        subItems: [
          { title: "Regular Teachers", url: "/dashboard/owner/teachers" },
          { title: "New Requests", url: "/dashboard/owner/teachers?status=new" },
          { title: "Blocked Teachers", url: "/dashboard/owner/teachers?status=blocked" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Financial",
    items: [
      {
        title: "Earnings",
        url: "/dashboard/owner/earnings",
        icon: CreditCard,
        subItems: [
          { title: "Overview", url: "/dashboard/owner/earnings" },
          { title: "Transaction History", url: "/dashboard/owner/earnings/transactions" },
          { title: "Payouts", url: "/dashboard/owner/earnings/payouts" },
          { title: "Tax Reports", url: "/dashboard/owner/earnings/tax" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Reputation",
    items: [
      {
        title: "Reviews",
        url: "/dashboard/owner/reviews",
        icon: Star,
        subItems: [
          { title: "All Reviews", url: "/dashboard/owner/reviews" },
          { title: "Respond to Reviews", url: "/dashboard/owner/reviews/respond" },
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
    label: "Management",
    items: [
      {
        title: "Reports",
        url: "/dashboard/owner/reports",
        icon: FileText,
        subItems: [
          { title: "Booking Reports", url: "/dashboard/owner/reports/bookings" },
          { title: "Financial Reports", url: "/dashboard/owner/reports/financial" },
          { title: "Performance Reports", url: "/dashboard/owner/reports/performance" },
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/owner/settings",
        icon: Settings,
        subItems: [
          { title: "Profile Settings", url: "/dashboard/owner/settings/profile" },
          { title: "Notification Settings", url: "/dashboard/owner/settings/notifications" },
          { title: "Pricing Settings", url: "/dashboard/owner/settings/pricing" },
        ],
      },
    ],
  },
];
