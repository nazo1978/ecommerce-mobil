import { z } from "zod";

// Giveaway requirement schema
export const GiveawayRequirementSchema = z.object({
  type: z.enum(["follow", "share", "tag_friends", "visit_store", "purchase_minimum"]),
  description: z.string().min(5, "Description must be at least 5 characters"),
  value: z.union([z.string(), z.number()]).optional(),
  isRequired: z.boolean().default(true),
});

// Create giveaway schema
export const CreateGiveawaySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  productId: z.string().min(1, "Product ID is required"),
  maxParticipants: z.number().int().min(1).optional(),
  entryPrice: z.number().min(0, "Entry price must be non-negative").default(0),
  currency: z.string().length(3, "Currency must be 3 characters").default("TRY"),
  startAt: z.string().datetime("Invalid start date"),
  endAt: z.string().datetime("Invalid end date"),
  requirements: z.array(GiveawayRequirementSchema).default([]),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  rules: z.string().min(50, "Rules must be at least 50 characters"),
  terms: z.string().min(50, "Terms must be at least 50 characters"),
}).refine(
  (data) => new Date(data.endAt) > new Date(data.startAt),
  {
    message: "End date must be after start date",
    path: ["endAt"],
  }
).refine(
  (data) => new Date(data.startAt) > new Date(),
  {
    message: "Start date must be in the future",
    path: ["startAt"],
  }
);

// Update giveaway schema
export const UpdateGiveawaySchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  maxParticipants: z.number().int().min(1).optional(),
  endAt: z.string().datetime().optional(),
  requirements: z.array(GiveawayRequirementSchema).optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  rules: z.string().min(50).optional(),
  terms: z.string().min(50).optional(),
});

// Enter giveaway schema
export const EnterGiveawaySchema = z.object({
  entryMethod: z.enum(["paid", "free", "referral"]).default("free"),
  paymentId: z.string().optional(),
  referredBy: z.string().optional(),
}).refine(
  (data) => data.entryMethod !== "paid" || data.paymentId,
  {
    message: "Payment ID is required for paid entries",
    path: ["paymentId"],
  }
).refine(
  (data) => data.entryMethod !== "referral" || data.referredBy,
  {
    message: "Referrer ID is required for referral entries",
    path: ["referredBy"],
  }
);

// Giveaway filter schema
export const GiveawayFilterSchema = z.object({
  status: z.enum(["upcoming", "active", "ended", "cancelled"]).optional(),
  vendorId: z.string().optional(),
  categoryId: z.string().optional(),
  entryPrice: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "startAt", "endAt", "participantCount", "entryPrice"]).default("startAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Update giveaway status schema
export const UpdateGiveawayStatusSchema = z.object({
  status: z.enum(["upcoming", "active", "ended", "cancelled"]),
  note: z.string().optional(),
});

// Select winner schema
export const SelectWinnerSchema = z.object({
  giveawayId: z.string().min(1, "Giveaway ID is required"),
  method: z.enum(["random", "manual"]).default("random"),
  winnerId: z.string().optional(),
}).refine(
  (data) => data.method !== "manual" || data.winnerId,
  {
    message: "Winner ID is required for manual selection",
    path: ["winnerId"],
  }
);

// Entry filter schema
export const EntryFilterSchema = z.object({
  giveawayId: z.string().optional(),
  userId: z.string().optional(),
  entryMethod: z.enum(["paid", "free", "referral"]).optional(),
  requirementsMet: z.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "entryMethod"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type CreateGiveawayDTO = z.infer<typeof CreateGiveawaySchema>;
export type UpdateGiveawayDTO = z.infer<typeof UpdateGiveawaySchema>;
export type EnterGiveawayDTO = z.infer<typeof EnterGiveawaySchema>;
export type GiveawayFilterDTO = z.infer<typeof GiveawayFilterSchema>;
export type UpdateGiveawayStatusDTO = z.infer<typeof UpdateGiveawayStatusSchema>;
export type SelectWinnerDTO = z.infer<typeof SelectWinnerSchema>;
export type EntryFilterDTO = z.infer<typeof EntryFilterSchema>;
export type GiveawayRequirementDTO = z.infer<typeof GiveawayRequirementSchema>;
