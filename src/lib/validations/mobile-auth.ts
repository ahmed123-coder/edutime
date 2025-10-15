import { z } from "zod";

// Mobile user registration schema
export const mobileRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER", "TEACHER", "PARTNER"])
    .optional()
    .default("TEACHER"),
  speciality: z.string().max(100).optional(),
  deviceId: z.string().optional(),
  deviceInfo: z.string().optional(),
});

// Mobile login schema
export const mobileLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  deviceId: z.string().optional(),
  deviceInfo: z.string().optional(),
});

// Mobile Google OAuth schema
export const mobileGoogleSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
  accessToken: z.string().min(1, "Google access token is required"),
  deviceId: z.string().optional(),
  deviceInfo: z.string().optional(),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  speciality: z.string().max(100).optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

// Device management schema
export const revokeDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
});

// Pagination schema for mobile endpoints
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  ...paginationSchema.shape,
});

// Booking filters schema
export const bookingFiltersSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  roomId: z.string().cuid().optional(),
  ...paginationSchema.shape,
});

// Create booking schema (mobile)
export const createMobileBookingSchema = z.object({
  roomId: z.string().cuid("Invalid room ID"),
  date: z.string().datetime("Invalid date format"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  paymentMethod: z.enum(["KONNECT", "CLICKTOPAY", "ON_SITE", "BANK_TRANSFER"]).optional(),
  notes: z.string().max(500).optional(),
  deviceInfo: z.string().optional(),
}).refine((data) => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Review schema (mobile)
export const createMobileReviewSchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(1000).optional(),
  deviceInfo: z.string().optional(),
});

// File upload schema
export const fileUploadSchema = z.object({
  type: z.enum(["avatar", "document", "photo"]),
  maxSize: z.number().positive().max(10 * 1024 * 1024).default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(["image/jpeg", "image/png", "image/webp"]),
});

// Notification settings schema
export const notificationSettingsSchema = z.object({
  push: z.boolean().default(true),
  email: z.boolean().default(true),
  bookingReminders: z.boolean().default(true),
  newMessages: z.boolean().default(true),
  promotions: z.boolean().default(false),
  systemUpdates: z.boolean().default(true),
});

// Export types
export type MobileRegisterInput = z.infer<typeof mobileRegisterSchema>;
export type MobileLoginInput = z.infer<typeof mobileLoginSchema>;
export type MobileGoogleInput = z.infer<typeof mobileGoogleSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RevokeDeviceInput = z.infer<typeof revokeDeviceSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type BookingFiltersInput = z.infer<typeof bookingFiltersSchema>;
export type CreateMobileBookingInput = z.infer<typeof createMobileBookingSchema>;
export type CreateMobileReviewInput = z.infer<typeof createMobileReviewSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;