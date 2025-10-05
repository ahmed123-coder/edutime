import { adminSidebarItems } from './admin-sidebar-items';
import { ownerSidebarItems } from './owner-sidebar-items';
import { teacherSidebarItems } from './teacher-sidebar-items';
import { sidebarItems } from './sidebar-items'; // Default/fallback items

export type UserRole = 'ADMIN' | 'CENTER_OWNER' | 'TRAINING_MANAGER' | 'TEACHER' | 'PARTNER';

export function getSidebarItems(userRole?: UserRole | string) {
  switch (userRole) {
    case 'ADMIN':
      return adminSidebarItems;
    case 'CENTER_OWNER':
    case 'TRAINING_MANAGER':
      return ownerSidebarItems;
    case 'TEACHER':
      return teacherSidebarItems;
    case 'PARTNER':
      // Partners can use teacher navigation for now, or create separate partner navigation
      return teacherSidebarItems;
    default:
      // Fallback to default sidebar items
      return sidebarItems;
  }
}

export function getDefaultDashboardUrl(userRole?: UserRole | string): string {
  switch (userRole) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'CENTER_OWNER':
    case 'TRAINING_MANAGER':
      return '/dashboard/owner';
    case 'TEACHER':
      return '/dashboard/teacher';
    case 'PARTNER':
      return '/dashboard/teacher'; // For now, partners use teacher dashboard
    default:
      // Fallback to teacher dashboard for unknown roles
      return '/dashboard/teacher';
  }
}
