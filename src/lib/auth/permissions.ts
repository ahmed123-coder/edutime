import { UserRole } from '@/generated/prisma';

export interface Permission {
  resource: string;
  action: string;
}

export const PERMISSIONS = {
  // Organization permissions
  ORGANIZATION_READ: { resource: 'organization', action: 'read' },
  ORGANIZATION_CREATE: { resource: 'organization', action: 'create' },
  ORGANIZATION_UPDATE: { resource: 'organization', action: 'update' },
  ORGANIZATION_DELETE: { resource: 'organization', action: 'delete' },
  
  // Room permissions
  ROOM_READ: { resource: 'room', action: 'read' },
  ROOM_CREATE: { resource: 'room', action: 'create' },
  ROOM_UPDATE: { resource: 'room', action: 'update' },
  ROOM_DELETE: { resource: 'room', action: 'delete' },
  
  // Booking permissions
  BOOKING_READ: { resource: 'booking', action: 'read' },
  BOOKING_CREATE: { resource: 'booking', action: 'create' },
  BOOKING_UPDATE: { resource: 'booking', action: 'update' },
  BOOKING_DELETE: { resource: 'booking', action: 'delete' },
  BOOKING_CONFIRM: { resource: 'booking', action: 'confirm' },
  BOOKING_CANCEL: { resource: 'booking', action: 'cancel' },
  
  // Review permissions
  REVIEW_READ: { resource: 'review', action: 'read' },
  REVIEW_CREATE: { resource: 'review', action: 'create' },
  REVIEW_RESPOND: { resource: 'review', action: 'respond' },
  REVIEW_MODERATE: { resource: 'review', action: 'moderate' },
  
  // Service permissions
  SERVICE_READ: { resource: 'service', action: 'read' },
  SERVICE_CREATE: { resource: 'service', action: 'create' },
  SERVICE_UPDATE: { resource: 'service', action: 'update' },
  SERVICE_DELETE: { resource: 'service', action: 'delete' },
  SERVICE_ORDER: { resource: 'service', action: 'order' },
  
  // User permissions
  USER_READ: { resource: 'user', action: 'read' },
  USER_CREATE: { resource: 'user', action: 'create' },
  USER_UPDATE: { resource: 'user', action: 'update' },
  USER_DELETE: { resource: 'user', action: 'delete' },
  
  // Payment permissions
  PAYMENT_READ: { resource: 'payment', action: 'read' },
  PAYMENT_PROCESS: { resource: 'payment', action: 'process' },
  PAYMENT_REFUND: { resource: 'payment', action: 'refund' },
  
  // Analytics permissions
  ANALYTICS_READ: { resource: 'analytics', action: 'read' },
} as const;

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admins have all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [UserRole.CENTER_OWNER]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.ROOM_CREATE,
    PERMISSIONS.ROOM_UPDATE,
    PERMISSIONS.ROOM_DELETE,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CONFIRM,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.REVIEW_READ,
    PERMISSIONS.REVIEW_RESPOND,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.USER_READ,
  ],
  
  [UserRole.TRAINING_MANAGER]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CONFIRM,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.REVIEW_READ,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.USER_READ,
  ],
  
  [UserRole.TEACHER]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.BOOKING_CREATE,
    PERMISSIONS.BOOKING_CANCEL,
    PERMISSIONS.REVIEW_READ,
    PERMISSIONS.REVIEW_CREATE,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_ORDER,
    PERMISSIONS.PAYMENT_READ,
  ],
  
  [UserRole.PARTNER]: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_UPDATE,
    PERMISSIONS.SERVICE_DELETE,
    PERMISSIONS.BOOKING_READ, // To see service orders
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.USER_READ,
  ],
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.some(
    p => p.resource === permission.resource && p.action === permission.action
  );
}

/**
 * Check if a user role has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user role has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Check if user can access a specific resource
 */
export function canAccessResource(userRole: UserRole, resource: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.some(p => p.resource === resource);
}

/**
 * Check if user can perform a specific action on a resource
 */
export function canPerformAction(
  userRole: UserRole, 
  resource: string, 
  action: string
): boolean {
  return hasPermission(userRole, { resource, action });
}
