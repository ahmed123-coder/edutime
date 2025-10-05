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
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/teacher",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Find & Book",
    items: [
      {
        title: "Search Centers",
        url: "/dashboard/teacher/search",
        icon: Search,
        subItems: [
          { title: "Map View", url: "/dashboard/teacher/search/map" },
          { title: "List View", url: "/dashboard/teacher/search/list" },
          { title: "Saved Searches", url: "/dashboard/teacher/search/saved" },
        ],
      },
      {
        title: "Favorites",
        url: "/dashboard/teacher/favorites",
        icon: Heart,
        subItems: [
          { title: "Favorite Centers", url: "/dashboard/teacher/favorites/centers" },
          { title: "Favorite Rooms", url: "/dashboard/teacher/favorites/rooms" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "My Bookings",
    items: [
      {
        title: "Bookings",
        url: "/dashboard/teacher/bookings",
        icon: Calendar,
        subItems: [
          { title: "Upcoming", url: "/dashboard/teacher/bookings?status=upcoming" },
          { title: "Past Bookings", url: "/dashboard/teacher/bookings?status=past" },
          { title: "Cancelled", url: "/dashboard/teacher/bookings?status=cancelled" },
          { title: "Calendar View", url: "/dashboard/teacher/bookings/calendar" },
        ],
      },
      {
        title: "Quick Book",
        url: "/dashboard/teacher/quick-book",
        icon: Clock,
        isNew: true,
      },
    ],
  },
  {
    id: 4,
    label: "Teaching",
    items: [
      {
        title: "My Classes",
        url: "/dashboard/teacher/classes",
        icon: BookOpen,
        subItems: [
          { title: "Current Classes", url: "/dashboard/teacher/classes/current" },
          { title: "Class History", url: "/dashboard/teacher/classes/history" },
          { title: "Class Materials", url: "/dashboard/teacher/classes/materials" },
        ],
      },
      {
        title: "Students",
        url: "/dashboard/teacher/students",
        icon: User,
        subItems: [
          { title: "Current Students", url: "/dashboard/teacher/students/current" },
          { title: "Student Progress", url: "/dashboard/teacher/students/progress" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Financial",
    items: [
      {
        title: "Payments",
        url: "/dashboard/teacher/payments",
        icon: CreditCard,
        subItems: [
          { title: "Payment History", url: "/dashboard/teacher/payments/history" },
          { title: "Pending Payments", url: "/dashboard/teacher/payments/pending" },
          { title: "Payment Methods", url: "/dashboard/teacher/payments/methods" },
        ],
      },
      {
        title: "Expenses",
        url: "/dashboard/teacher/expenses",
        icon: FileText,
        subItems: [
          { title: "Booking Expenses", url: "/dashboard/teacher/expenses/bookings" },
          { title: "Tax Documents", url: "/dashboard/teacher/expenses/tax" },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Community",
    items: [
      {
        title: "Reviews",
        url: "/dashboard/teacher/reviews",
        icon: Star,
        subItems: [
          { title: "My Reviews", url: "/dashboard/teacher/reviews/received" },
          { title: "Write Reviews", url: "/dashboard/teacher/reviews/write" },
        ],
      },
      {
        title: "Messages",
        url: "/dashboard/teacher/messages",
        icon: MessageSquare,
        subItems: [
          { title: "Center Owners", url: "/dashboard/teacher/messages/owners" },
          { title: "Support", url: "/dashboard/teacher/messages/support" },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Account",
    items: [
      {
        title: "Profile",
        url: "/dashboard/teacher/profile",
        icon: User,
        subItems: [
          { title: "Personal Info", url: "/dashboard/teacher/profile" },
          { title: "Teaching Credentials", url: "/dashboard/teacher/profile/credentials" },
          { title: "Verification", url: "/dashboard/teacher/profile/verification" },
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/teacher/settings",
        icon: Settings,
        subItems: [
          { title: "Preferences", url: "/dashboard/teacher/settings/preferences" },
          { title: "Notifications", url: "/dashboard/teacher/settings/notifications" },
          { title: "Privacy", url: "/dashboard/teacher/settings/privacy" },
        ],
      },
    ],
  },
];
