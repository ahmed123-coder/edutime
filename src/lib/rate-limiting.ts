import { NextRequest } from "next/server";
import { ApiResponse, ErrorCode, HttpStatus } from "@/types/mobile-api";

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastAccess: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;

    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed
   */
  check(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.config.keyGenerator ? this.config.keyGenerator(request) : this.getDefaultKey(request);
    const now = Date.now();

    let entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset existing one
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
        lastAccess: now,
      };
      this.store.set(key, entry);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: entry.resetTime,
      };
    }

    // Update existing entry
    entry.count++;
    entry.lastAccess = now;

    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    const allowed = entry.count <= this.config.maxRequests;

    if (allowed) {
      this.store.set(key, entry);
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Get default key for rate limiting (IP-based)
   */
  private getDefaultKey(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
    return `ip:${ip}`;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime + this.config.windowMs) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get current rate limit status for a key
   */
  getStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }
}

// Predefined rate limiters for different use cases

/**
 * General API rate limiter - 100 requests per 15 minutes per IP
 */
export const generalRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

/**
 * Authentication rate limiter - 5 requests per minute per IP
 */
export const authRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
  keyGenerator: (request: NextRequest) => {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
    return `auth:ip:${ip}`;
  },
});

/**
 * Registration rate limiter - 3 registrations per hour per IP
 */
export const registrationRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyGenerator: (request: NextRequest) => {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
    return `register:ip:${ip}`;
  },
});

/**
 * Password reset rate limiter - 3 requests per hour per email
 */
export const passwordResetRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyGenerator: (request: NextRequest) => {
    // Try to extract email from request body for email-based limiting
    const url = request.url;
    if (url.includes("forgot-password") || url.includes("reset-password")) {
      return `reset:ip:${request.headers.get("x-forwarded-for") || "unknown"}`;
    }
    return `reset:ip:${request.headers.get("x-forwarded-for") || "unknown"}`;
  },
});

/**
 * User-specific rate limiter - 200 requests per 15 minutes per user
 */
export const userRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 200,
  keyGenerator: (request: NextRequest) => {
    // This would require authentication middleware to run first
    const user = (request as any).user;
    if (user) {
      return `user:${user.id}`;
    }
    // Fallback to IP-based limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
    return `ip:${ip}`;
  },
});

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  limiter: RateLimiter,
  options: { skipOnFailure?: boolean } = {}
) {
  return (handler: (request: NextRequest) => Promise<Response>) => {
    return async (request: NextRequest): Promise<Response> => {
      try {
        const result = limiter.check(request);

        if (!result.allowed) {
          // Return rate limit exceeded response
          return new Response(
            JSON.stringify({
              success: false,
              error: {
                code: ErrorCode.RATE_LIMIT_EXCEEDED,
                message: "Too many requests, please try again later",
              },
              meta: {
                timestamp: new Date().toISOString(),
                requestId: crypto.randomUUID(),
                rateLimit: {
                  remaining: result.remaining,
                  resetTime: new Date(result.resetTime).toISOString(),
                },
              },
            } as ApiResponse),
            {
              status: HttpStatus.TOO_MANY_REQUESTS,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": limiter["config"].maxRequests.toString(),
                "X-RateLimit-Remaining": result.remaining.toString(),
                "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
                "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
              },
            }
          );
        }

        // Add rate limit headers to successful response
        const response = await handler(request);

        // Clone response to add headers
        const responseClone = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });

        responseClone.headers.set("X-RateLimit-Limit", limiter["config"].maxRequests.toString());
        responseClone.headers.set("X-RateLimit-Remaining", result.remaining.toString());
        responseClone.headers.set("X-RateLimit-Reset", new Date(result.resetTime).toISOString());

        return responseClone;

      } catch (error) {
        if (!options.skipOnFailure) {
          throw error;
        }
        return handler(request);
      }
    };
  };
}

/**
 * Rate limiting middleware for authentication endpoints
 */
export const withAuthRateLimit = withRateLimit(authRateLimiter);

/**
 * Rate limiting middleware for registration endpoints
 */
export const withRegistrationRateLimit = withRateLimit(registrationRateLimiter);

/**
 * Rate limiting middleware for password reset endpoints
 */
export const withPasswordResetRateLimit = withRateLimit(passwordResetRateLimiter);

/**
 * Rate limiting middleware for general API endpoints
 */
export const withGeneralRateLimit = withRateLimit(generalRateLimiter);