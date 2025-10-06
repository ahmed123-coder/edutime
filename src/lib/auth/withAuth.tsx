"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { UserRole } from "@/generated/prisma";

import { hasPermission, Permission } from "./permissions";

interface WithAuthOptions {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  redirectTo?: string;
  requireVerification?: boolean;
}

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>, options: WithAuthOptions = {}) {
  const {
    requiredRoles = [],
    requiredPermissions = [],
    redirectTo = "/auth/login",
    requireVerification = true,
  } = options;

  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Still loading

      // Not authenticated
      if (!session) {
        router.push(redirectTo);
        return;
      }

      // Check email verification
      if (requireVerification && !session.user.verified) {
        router.push("/auth/verify-email");
        return;
      }

      // Check required roles
      if (requiredRoles.length > 0 && !requiredRoles.includes(session.user.role)) {
        router.push("/dashboard"); // Redirect to default dashboard
        return;
      }

      // Check required permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every((permission) =>
          hasPermission(session.user.role, permission),
        );

        if (!hasRequiredPermissions) {
          router.push("/dashboard"); // Redirect to default dashboard
          return;
        }
      }
    }, [session, status, router]);

    // Show loading state
    if (status === "loading") {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Not authenticated
    if (!session) {
      return null;
    }

    // Not verified
    if (requireVerification && !session.user.verified) {
      return null;
    }

    // Check roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(session.user.role)) {
      return null;
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every((permission) =>
        hasPermission(session.user.role, permission),
      );

      if (!hasRequiredPermissions) {
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}

// Convenience HOCs for specific roles
export const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  withAuth(WrappedComponent, { requiredRoles: [UserRole.ADMIN] });

export const withCenterOwnerAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  withAuth(WrappedComponent, {
    requiredRoles: [UserRole.CENTER_OWNER, UserRole.TRAINING_MANAGER],
  });

export const withTeacherAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  withAuth(WrappedComponent, { requiredRoles: [UserRole.TEACHER] });

export const withPartnerAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  withAuth(WrappedComponent, { requiredRoles: [UserRole.PARTNER] });

// Hook for checking permissions in components
export function usePermissions() {
  const { data: session } = useSession();

  const checkPermission = (permission: Permission): boolean => {
    if (!session?.user?.role) return false;
    return hasPermission(session.user.role, permission);
  };

  const checkRole = (roles: UserRole[]): boolean => {
    if (!session?.user?.role) return false;
    return roles.includes(session.user.role);
  };

  return {
    checkPermission,
    checkRole,
    userRole: session?.user?.role,
    isAuthenticated: !!session,
    isVerified: session?.user?.verified || false,
  };
}
