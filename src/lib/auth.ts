import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { UserRole } from "@prisma/client";

import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // For demo purposes, we'll check against a simple password
        // In production, you'd store hashed passwords
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.verified = user.verified;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.verified = token.verified;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Handle Google OAuth sign-in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user with default TEACHER role
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              role: UserRole.TEACHER,
              verified: true, // Google accounts are pre-verified
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      // Send welcome email or perform other actions
      console.log("New user created:", user.email);
    },
  },
};

// Helper function to get server session
export async function getServerSession() {
  const { getServerSession } = await import("next-auth");
  return getServerSession(authOptions);
}

// Helper function to check if user has required role
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Helper function to check permissions
export function hasPermission(userRole: UserRole, action: string, resource: string): boolean {
  const permissions = {
    [UserRole.ADMIN]: ["*"],
    [UserRole.CENTER_OWNER]: [
      "organization:read",
      "organization:update",
      "room:create",
      "room:read",
      "room:update",
      "room:delete",
      "booking:read",
      "booking:confirm",
      "booking:cancel",
      "review:respond",
    ],
    [UserRole.TRAINING_MANAGER]: [
      "organization:read",
      "room:read",
      "booking:read",
      "booking:confirm",
      "booking:cancel",
    ],
    [UserRole.TEACHER]: [
      "organization:read",
      "room:read",
      "booking:create",
      "booking:read",
      "booking:cancel",
      "review:create",
      "service:order",
    ],
    [UserRole.PARTNER]: [
      "service:create",
      "service:read",
      "service:update",
      "service:delete",
      "order:read",
      "order:update",
    ],
  };

  const userPermissions = permissions[userRole] || [];
  return userPermissions.includes("*") || userPermissions.includes(`${resource}:${action}`);
}
