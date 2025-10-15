import { prisma } from "./prisma";
import { MobileJWTService } from "./mobile-jwt";

export interface RefreshTokenData {
  id: string;
  userId: string;
  token: string;
  deviceId: string | null;
  deviceInfo: string | null;
  lastUsed: Date;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

export interface CreateRefreshTokenData {
  userId: string;
  token: string;
  deviceId?: string;
  deviceInfo?: string;
}

export class RefreshTokenService {
  /**
   * Create a new refresh token record
   */
  static async createRefreshToken(data: CreateRefreshTokenData): Promise<RefreshTokenData> {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        deviceId: data.deviceId || null,
        deviceInfo: data.deviceInfo || null,
        lastUsed: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isRevoked: false,
      },
    });

    return refreshToken as RefreshTokenData;
  }

  /**
   * Find refresh token by token string
   */
  static async findByToken(token: string): Promise<RefreshTokenData | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    return refreshToken as RefreshTokenData | null;
  }

  /**
   * Find refresh tokens by user ID
   */
  static async findByUserId(userId: string): Promise<RefreshTokenData[]> {
    const refreshTokens = await prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return refreshTokens as RefreshTokenData[];
  }

  /**
   * Find refresh tokens by device ID
   */
  static async findByDeviceId(deviceId: string): Promise<RefreshTokenData[]> {
    const refreshTokens = await prisma.refreshToken.findMany({
      where: { deviceId },
      orderBy: { createdAt: "desc" },
    });

    return refreshTokens as RefreshTokenData[];
  }

  /**
   * Update last used timestamp for refresh token
   */
  static async updateLastUsed(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: { lastUsed: new Date() },
    });
  }

  /**
   * Revoke a specific refresh token
   */
  static async revokeToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for a user
   */
  static async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for a device
   */
  static async revokeDeviceTokens(deviceId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { deviceId },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoke all tokens except the current one
   */
  static async revokeOtherTokens(userId: string, currentToken: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        token: { not: currentToken },
        isRevoked: false,
      },
      data: { isRevoked: true },
    });
  }

  /**
   * Validate refresh token
   */
  static async validateRefreshToken(token: string): Promise<{
    isValid: boolean;
    refreshToken?: RefreshTokenData;
    error?: string;
  }> {
    try {
      // Check if token exists in database
      const refreshToken = await this.findByToken(token);

      if (!refreshToken) {
        return { isValid: false, error: "Refresh token not found" };
      }

      // Check if token is revoked
      if (refreshToken.isRevoked) {
        return { isValid: false, error: "Refresh token has been revoked" };
      }

      // Check if token is expired
      if (refreshToken.expiresAt < new Date()) {
        return { isValid: false, error: "Refresh token has expired" };
      }

      // Verify JWT token
      try {
        MobileJWTService.verifyRefreshToken(token);
      } catch (error) {
        return { isValid: false, error: "Invalid refresh token signature" };
      }

      // Update last used timestamp
      await this.updateLastUsed(token);

      return { isValid: true, refreshToken };
    } catch (error) {
      console.error("Refresh token validation error:", error);
      return { isValid: false, error: "Internal server error" };
    }
  }

  /**
   * Clean up expired refresh tokens
   */
  static async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  /**
   * Clean up revoked tokens older than 30 days
   */
  static async cleanupRevokedTokens(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.refreshToken.deleteMany({
      where: {
        isRevoked: true,
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    return result.count;
  }

  /**
   * Get active devices for a user
   */
  static async getUserActiveDevices(userId: string): Promise<Array<{
    deviceId: string;
    deviceInfo: string | null;
    lastUsed: Date;
  }>> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
        deviceId: { not: null },
      },
      select: {
        deviceId: true,
        deviceInfo: true,
        lastUsed: true,
      },
      distinct: ["deviceId"],
      orderBy: { lastUsed: "desc" },
    });

    return tokens.filter(token => token.deviceId !== null);
  }

  /**
   * Generate device info from request
   */
  static generateDeviceInfo(request: Request): string {
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "Unknown";

    return `${userAgent} (${ip})`;
  }
}