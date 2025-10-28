import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { MobileJWTService, JWTPayload, TokenPair } from "./mobile-jwt";
import { UserRole } from "@prisma/client";

export interface MobileUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  verified: boolean;
  phone: string | null;
  speciality: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MobileAuthResult {
  success: boolean;
  user?: MobileUser;
  tokens?: TokenPair;
  error?: string;
  needsVerification?: boolean;
}

export class MobileAuthService {
  /**
   * Authenticate user with email and password
   */
  static async authenticateUser(
    email: string,
    password: string,
    deviceId?: string
  ): Promise<MobileAuthResult> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password || "");
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      // Check if email is verified
      if (!user.verified) {
        return {
          success: false,
          error: "Email not verified",
          needsVerification: true,
        };
      }

      // Generate tokens
      const tokens = MobileJWTService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        deviceId,
      });

      // Update last login timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });

      const mobileUser: MobileUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        phone: user.phone,
        speciality: user.speciality,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        user: mobileUser,
        tokens,
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Authenticate user with Google OAuth
   */
  static async authenticateGoogleUser(
    googleEmail: string,
    googleName: string,
    googleId: string,
    deviceId?: string
  ): Promise<MobileAuthResult> {
    try {
      // Find user by Google account
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: googleId,
          },
        },
        include: {
          user: true,
        },
      });

      if (account && account.user) {
        // User exists, generate tokens
        const tokens = MobileJWTService.generateTokenPair({
          userId: account.user.id,
          email: account.user.email,
          role: account.user.role,
          verified: account.user.verified,
          deviceId,
        });

        const mobileUser: MobileUser = {
          id: account.user.id,
          email: account.user.email,
          name: account.user.name,
          role: account.user.role,
          verified: account.user.verified,
          phone: account.user.phone,
          speciality: account.user.speciality,
          avatar: account.user.avatar,
          createdAt: account.user.createdAt,
          updatedAt: account.user.updatedAt,
        };

        return {
          success: true,
          user: mobileUser,
          tokens,
        };
      } else {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: googleEmail },
        });

        if (existingUser) {
          // Link Google account to existing user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: googleId,
              access_token: "", // Will be updated by NextAuth
              expires_at: null,
              token_type: "",
              scope: "",
              id_token: "",
              session_state: "",
            },
          });

          const tokens = MobileJWTService.generateTokenPair({
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            verified: existingUser.verified,
            deviceId,
          });

          const mobileUser: MobileUser = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
            verified: existingUser.verified,
            phone: existingUser.phone,
            speciality: existingUser.speciality,
            avatar: existingUser.avatar,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
          };

          return {
            success: true,
            user: mobileUser,
            tokens,
          };
        } else {
          // Create new user with Google account
          const newUser = await prisma.user.create({
            data: {
              email: googleEmail,
              name: googleName,
              role: UserRole.TEACHER,
              verified: true, // Google accounts are pre-verified
            },
          });

          // Create Google account link
          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: googleId,
              access_token: "",
              expires_at: null,
              token_type: "",
              scope: "",
              id_token: "",
              session_state: "",
            },
          });

          const tokens = MobileJWTService.generateTokenPair({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
            verified: newUser.verified,
            deviceId,
          });

          const mobileUser: MobileUser = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            verified: newUser.verified,
            phone: newUser.phone,
            speciality: newUser.speciality,
            avatar: newUser.avatar,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          };

          return {
            success: true,
            user: mobileUser,
            tokens,
          };
        }
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  }

  /**
   * Refresh tokens using refresh token
   */
  static async refreshTokens(refreshToken: string): Promise<MobileAuthResult> {
    try {
      // Verify refresh token
      const payload = MobileJWTService.verifyRefreshToken(refreshToken);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      if (!user.verified) {
        return {
          success: false,
          error: "Email not verified",
          needsVerification: true,
        };
      }

      // Generate new tokens
      const tokens = MobileJWTService.generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        deviceId: payload.deviceId,
      });

      const mobileUser: MobileUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        phone: user.phone,
        speciality: user.speciality,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        user: mobileUser,
        tokens,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return {
        success: false,
        error: "Invalid or expired refresh token",
      };
    }
  }

  /**
   * Get user profile from request
   */
  static async getUserFromRequest(request: NextRequest): Promise<MobileUser | null> {
    try {
      const authHeader = request.headers.get("authorization");
      const token = MobileJWTService.extractTokenFromHeader(authHeader);

      if (!token) {
        return null;
      }

      const payload = MobileJWTService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        phone: user.phone,
        speciality: user.speciality,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error("User verification error:", error);
      return null;
    }
  }

  /**
   * Check if user has required role
   */
  static hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(userRole);
  }

  /**
   * Verify password using bcrypt
   */
  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = require("bcryptjs");
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate device fingerprint
   */
  static generateDeviceFingerprint(request: NextRequest): string {
    const userAgent = request.headers.get("user-agent") || "";
    const ip = request.headers.get("x-forwarded-for") ||
              request.headers.get("x-real-ip") ||
              "unknown";

    // Simple fingerprint - in production, you might want to use a more sophisticated method
    return Buffer.from(`${userAgent}-${ip}-${Date.now()}`).toString("base64");
  }
}