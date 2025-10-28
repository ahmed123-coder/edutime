import { prisma } from "./db";

// Note: RefreshToken model doesn't exist in schema, so we'll use in-memory storage for now
// This should be replaced with a proper RefreshToken model in the Prisma schema

// In-memory storage for refresh tokens (temporary solution)
const refreshTokens = new Map<string, RefreshTokenData>();

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
    const refreshToken: RefreshTokenData = {
      id: crypto.randomUUID(),
      userId: data.userId,
      token: data.token,
      deviceId: data.deviceId || null,
      deviceInfo: data.deviceInfo || null,
      lastUsed: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isRevoked: false,
      createdAt: new Date(),
    };

    refreshTokens.set(data.token, refreshToken);
    return refreshToken;
  }

  /**
   * Find refresh token by token string
   */
  static async findByToken(token: string): Promise<RefreshTokenData | null> {
    return refreshTokens.get(token) || null;
  }

  /**
   * Find refresh tokens by user ID
   */
  static async findByUserId(userId: string): Promise<RefreshTokenData[]> {
    const tokens: RefreshTokenData[] = [];
    for (const [token, data] of refreshTokens.entries()) {
      if (data.userId === userId) {
        tokens.push(data);
      }
    }
    return tokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Find refresh tokens by device ID
   */
  static async findByDeviceId(deviceId: string): Promise<RefreshTokenData[]> {
    const tokens: RefreshTokenData[] = [];
    for (const [token, data] of refreshTokens.entries()) {
      if (data.deviceId === deviceId) {
        tokens.push(data);
      }
    }
    return tokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Update last used timestamp for refresh token
   */
  static async updateLastUsed(token: string): Promise<void> {
    const refreshToken = refreshTokens.get(token);
    if (refreshToken) {
      refreshToken.lastUsed = new Date();
    }
  }

  /**
   * Revoke a specific refresh token
   */
  static async revokeToken(token: string): Promise<void> {
    const refreshToken = refreshTokens.get(token);
    if (refreshToken) {
      refreshToken.isRevoked = true;
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  static async revokeAllUserTokens(userId: string): Promise<void> {
    for (const [token, data] of refreshTokens.entries()) {
      if (data.userId === userId) {
        data.isRevoked = true;
      }
    }
  }

  /**
   * Revoke all refresh tokens for a device
   */
  static async revokeDeviceTokens(deviceId: string): Promise<void> {
    for (const [token, data] of refreshTokens.entries()) {
      if (data.deviceId === deviceId) {
        data.isRevoked = true;
      }
    }
  }

  /**
   * Revoke all tokens except the current one
   */
  static async revokeOtherTokens(userId: string, currentToken: string): Promise<void> {
    for (const [token, data] of refreshTokens.entries()) {
      if (data.userId === userId && token !== currentToken && !data.isRevoked) {
        data.isRevoked = true;
      }
    }
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

      // For now, skip JWT verification since MobileJWTService doesn't exist
      // TODO: Implement JWT verification when MobileJWTService is available
      // try {
      //   MobileJWTService.verifyRefreshToken(token);
      // } catch (error) {
      //   return { isValid: false, error: "Invalid refresh token signature" };
      // }

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
    const now = new Date();
    let count = 0;
    for (const [token, data] of refreshTokens.entries()) {
      if (data.expiresAt < now) {
        refreshTokens.delete(token);
        count++;
      }
    }
    return count;
  }

  /**
   * Clean up revoked tokens older than 30 days
   */
  static async cleanupRevokedTokens(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let count = 0;
    for (const [token, data] of refreshTokens.entries()) {
      if (data.isRevoked && data.createdAt < thirtyDaysAgo) {
        refreshTokens.delete(token);
        count++;
      }
    }
    return count;
  }

  /**
   * Get active devices for a user
   */
  static async getUserActiveDevices(userId: string): Promise<Array<{
    deviceId: string;
    deviceInfo: string | null;
    lastUsed: Date;
  }>> {
    const now = new Date();
    const devices = new Map<string, {
      deviceId: string;
      deviceInfo: string | null;
      lastUsed: Date;
    }>();

    for (const [token, data] of refreshTokens.entries()) {
      if (
        data.userId === userId &&
        !data.isRevoked &&
        data.expiresAt > now &&
        data.deviceId
      ) {
        devices.set(data.deviceId, {
          deviceId: data.deviceId,
          deviceInfo: data.deviceInfo,
          lastUsed: data.lastUsed,
        });
      }
    }

    return Array.from(devices.values()).sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
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