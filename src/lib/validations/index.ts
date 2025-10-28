import { z } from "zod";

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER", "TEACHER", "PARTNER"]),
  speciality: z.string().max(100).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const updateUserSchema = createUserSchema.partial();

// Organization validation schemas
export const addressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().optional(), // Slug will be generated from name if not provided
  description: z.string().max(1000).optional(),
  type: z.enum(["TRAINING_CENTER", "PARTNER_SERVICE"]),
  subscription: z.enum(["ESSENTIAL", "PRO", "PREMIUM"]).optional(),
  address: addressSchema,
  coordinates: coordinatesSchema.optional(),
  hours: z.record(z.any()).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

// Room validation schemas
export const createRoomSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().int().min(1, "Capacity must be at least 1").max(1000),
  area: z.number().positive("Area must be positive").optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  equipment: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

// Booking validation schemas
export const createBookingSchema = z
  .object({
    roomId: z.string().cuid("Invalid room ID"),
    date: z.string().datetime("Invalid date format"),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    paymentMethod: z.enum(["KONNECT", "CLICKTOPAY", "ON_SITE", "BANK_TRANSFER"]).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// Review validation schemas
export const createReviewSchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().max(1000).optional(),
});

export const respondToReviewSchema = z.object({
  response: z.string().min(1, "Response cannot be empty").max(1000),
});

// Promotion validation schemas
export const createPromotionSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z.string().max(500).optional(),
    code: z.string().min(3, "Code must be at least 3 characters").max(20).optional(),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_HOURS"]),
    value: z.number().positive("Value must be positive"),
    minAmount: z.number().positive().optional(),
    maxDiscount: z.number().positive().optional(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
    usageLimit: z.number().int().positive().optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Service validation schemas
export const createServiceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["PRINTING", "PHOTOCOPYING", "DOCUMENT_DELIVERY", "CATERING", "EQUIPMENT_RENTAL", "OTHER"]),
  price: z.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit must be specified").max(50),
});

export const createServiceOrderSchema = z.object({
  serviceId: z.string().cuid("Invalid service ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
  notes: z.string().max(500).optional(),
  deliveryAddress: z.string().max(200).optional(),
  deliveryDate: z.string().datetime().optional(),
});

// Search validation schemas
export const searchOrganizationsSchema = z.object({
  query: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type RespondToReviewInput = z.infer<typeof respondToReviewSchema>;
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateServiceOrderInput = z.infer<typeof createServiceOrderSchema>;
export type SearchOrganizationsInput = z.infer<typeof searchOrganizationsSchema>;
