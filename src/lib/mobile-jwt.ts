import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  verified: boolean;
  deviceId?: string;
  type: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export class MobileJWTService {
  private static readonly ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

  /**
   * Generate an access token for mobile authentication
   */
  static generateAccessToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign(
      {
        ...payload,
        type: "access",
      } as JWTPayload,
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
        issuer: "edutime-mobile",
        audience: "edutime-mobile-app",
      }
    );
  }

  /**
   * Generate a refresh token for mobile authentication
   */
  static generateRefreshToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign(
      {
        ...payload,
        type: "refresh",
      } as JWTPayload,
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
        issuer: "edutime-mobile",
        audience: "edutime-mobile-app",
      }
    );
  }

  /**
   * Generate a token pair for mobile authentication
   */
  static generateTokenPair(payload: Omit<JWTPayload, "type">): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      tokenType: "Bearer",
    };
  }

  /**
   * Verify and decode an access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!, {
        issuer: "edutime-mobile",
        audience: "edutime-mobile-app",
      }) as JWTPayload;

      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Access token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid access token");
      } else {
        throw error;
      }
    }
  }

  /**
   * Verify and decode a refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!, {
        issuer: "edutime-mobile",
        audience: "edutime-mobile-app",
      }) as JWTPayload;

      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      } else {
        throw error;
      }
    }
  }

  /**
   * Get remaining time until token expires (in seconds)
   */
  static getTokenRemainingTime(token: string): number {
    try {
      const decoded = jwt.decode(token) as any;
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, decoded.exp - now);
    } catch {
      return 0;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    return this.getTokenRemainingTime(token) <= 0;
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }
}