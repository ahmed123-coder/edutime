import { UserRole } from "@prisma/client";

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  meta: ApiResponse["meta"] & {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// User Types
export interface MobileUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  verified: boolean;
  phone: string | null;
  speciality: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MobileAuthUser extends MobileUser {
  // Additional auth-specific fields if needed
}

// Token Types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  verified: boolean;
  deviceId?: string;
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

// Device Types
export interface DeviceInfo {
  deviceId: string;
  deviceName?: string;
  platform?: string;
  osVersion?: string;
  appVersion?: string;
  lastUsed: string;
  isActive: boolean;
}

// Booking Types
export interface MobileBooking {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentMethod: "KONNECT" | "CLICKTOPAY" | "ON_SITE" | "BANK_TRANSFER";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  room?: MobileRoom;
  user?: MobileUser;
}

export interface MobileRoom {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  capacity: number;
  area?: number;
  hourlyRate: number;
  equipment: string[];
  amenities: string[];
  photos: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: MobileOrganization;
}

export interface MobileOrganization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: "TRAINING_CENTER" | "PARTNER_SERVICE";
  subscription: "ESSENTIAL" | "PRO" | "PREMIUM";
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  verified: boolean;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface MobileReview {
  id: string;
  organizationId: string;
  userId: string;
  rating: number;
  comment?: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: MobileUser;
  organization?: MobileOrganization;
}

// Service Types
export interface MobileService {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  category: "PRINTING" | "PHOTOCOPYING" | "DOCUMENT_DELIVERY" | "CATERING" | "EQUIPMENT_RENTAL" | "OTHER";
  price: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: MobileOrganization;
}

export interface MobileServiceOrder {
  id: string;
  serviceId: string;
  userId: string;
  quantity: number;
  notes?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  service?: MobileService;
  user?: MobileUser;
}

// Notification Types
export interface MobileNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "BOOKING" | "PAYMENT" | "SYSTEM";
  isRead: boolean;
  data?: any; // Additional data payload
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  bookingReminders: boolean;
  newMessages: boolean;
  promotions: boolean;
  systemUpdates: boolean;
}

// File Upload Types
export interface FileUpload {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  type: "avatar" | "document" | "photo";
  uploadedBy: string;
  createdAt: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  amenities?: string[];
  category?: string;
  sortBy?: "name" | "rating" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface BookingFilters {
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  dateFrom?: string;
  dateTo?: string;
  roomId?: string;
  organizationId?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export const ErrorCode = {
  // Authentication errors
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",

  // Business logic errors
  ROOM_NOT_AVAILABLE: "ROOM_NOT_AVAILABLE",
  INVALID_TIME_SLOT: "INVALID_TIME_SLOT",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",

  // System errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

// Request/Response DTOs
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
  deviceInfo?: string;
}

export interface LoginResponse {
  user: MobileAuthUser;
  tokens: TokenPair;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role?: UserRole;
  speciality?: string;
  deviceId?: string;
  deviceInfo?: string;
}

export interface RegisterResponse {
  user: MobileAuthUser;
  message: string;
  requiresVerification: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  user: MobileAuthUser;
  tokens: TokenPair;
}

export interface GoogleAuthRequest {
  idToken: string;
  accessToken: string;
  deviceId?: string;
  deviceInfo?: string;
}

export interface GoogleAuthResponse {
  user: MobileAuthUser;
  tokens: TokenPair;
  isNewUser: boolean;
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}