import { NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";

import { getDefaultDashboardUrl } from "@/navigation/sidebar/get-sidebar-items";
// import { hasActiveSubscription } from '@/lib/subscription-check'; // Disabled for Edge Runtime compatibility

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
      "/",
      "/auth/login",
      "/auth/register",
      "/auth/verify-email",
      "/auth/error",
      "/about",
      "/contact",
      "/pricing",
      "/search",
      "/centers",
      "/specialists",
      "/partners",
      "/privacy",
      "/terms",
      "/help",
      "/organizations",
      "/api/mobile",
      "/api/docs",
    ];

    // Check if route is public
    const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // API routes protection
    if (pathname.startsWith("/api/")) {
      // Allow auth API routes
      if (pathname.startsWith("/api/auth/")) {
        return NextResponse.next();
      }

      // Allow mobile API routes (they handle their own authentication)
      if (pathname.startsWith("/api/mobile/")) {
        return NextResponse.next();
      }

      // Allow docs API routes
      if (pathname.startsWith("/api/docs")) {
        return NextResponse.next();
      }

      // Require authentication for other API routes
      if (!token) {
        return new NextResponse(JSON.stringify({ error: "Authentication required" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      // Admin-only API routes
      if (pathname.startsWith("/api/admin/")) {
        if (token.role !== "ADMIN") {
          return new NextResponse(JSON.stringify({ error: "Admin access required" }), {
            status: 403,
            headers: { "content-type": "application/json" },
          });
        }
      }

      return NextResponse.next();
    }

    // Dashboard routes protection
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      // Check email verification
      if (!token.verified) {
        return NextResponse.redirect(new URL("/auth/verify-email", req.url));
      }

      // Check subscription status (except for admins)
      // Temporarily disabled for Edge Runtime compatibility
      // TODO: Move subscription check to server-side components
      /*
      if (token.role !== 'ADMIN') {
        try {
          const hasValidSubscription = await hasActiveSubscription(
            token.sub as string,
            token.role as string
          );

          if (!hasValidSubscription) {
            return NextResponse.redirect(new URL('/subscription-expired', req.url));
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
          // Continue if there's an error checking subscription
        }
      }
      */

      // Role-based dashboard access
      const userRole = token.role as string;

      // Admin dashboard
      if (pathname.startsWith("/dashboard/admin")) {
        if (userRole !== "ADMIN") {
          const userDashboard = getDefaultDashboardUrl(userRole);
          return NextResponse.redirect(new URL(userDashboard, req.url));
        }
      }

      // Center owner/manager dashboard
      if (pathname.startsWith("/dashboard/owner")) {
        if (!["CENTER_OWNER", "TRAINING_MANAGER"].includes(userRole)) {
          const userDashboard = getDefaultDashboardUrl(userRole);
          return NextResponse.redirect(new URL(userDashboard, req.url));
        }
      }

      // Teacher dashboard
      if (pathname.startsWith("/dashboard/teacher")) {
        if (userRole !== "TEACHER") {
          const userDashboard = getDefaultDashboardUrl(userRole);
          return NextResponse.redirect(new URL(userDashboard, req.url));
        }
      }

      // Partner dashboard
      if (pathname.startsWith("/dashboard/partner")) {
        if (userRole !== "PARTNER") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      return NextResponse.next();
    }

    // Default: allow access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow access to public routes
        const publicRoutes = [
          "/",
          "/auth/login",
          "/auth/register",
          "/auth/verify-email",
          "/auth/error",
          "/about",
          "/contact",
          "/pricing",
          "/search",
          "/centers",
          "/specialists",
          "/partners",
          "/privacy",
          "/terms",
          "/help",
          "/organizations",
          "/api/mobile",
          "/api/docs",
        ];

        const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

        if (isPublicRoute) {
          return true;
        }

        // Require token for protected routes
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
