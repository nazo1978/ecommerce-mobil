import { z } from "zod";

// MLM settings schema
export const MLMSettingsSchema = z.object({
  level1Rate: z.number().min(0).max(100, "Rate cannot exceed 100%"),
  level2Rate: z.number().min(0).max(100, "Rate cannot exceed 100%"),
  level3Rate: z.number().min(0).max(100, "Rate cannot exceed 100%"),
  maxLevels: z.number().int().min(1).max(3).default(3),
  minOrderAmount: z.number().min(0, "Minimum order amount must be non-negative"),
  maxMonthlyEarnings: z.number().min(0).optional(),
  minPayoutAmount: z.number().min(0, "Minimum payout amount must be non-negative"),
  payoutFrequency: z.enum(["weekly", "monthly", "quarterly"]).default("monthly"),
  payoutDay: z.number().int().min(1).max(31).default(1),
  isActive: z.boolean().default(true),
  terms: z.string().min(100, "Terms must be at least 100 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

// Update MLM settings schema
export const UpdateMLMSettingsSchema = MLMSettingsSchema.partial();

// Create referral schema
export const CreateReferralSchema = z.object({
  referredId: z.string().min(1, "Referred user ID is required"),
  referralCode: z.string().min(1, "Referral code is required"),
});

// Commission filter schema
export const CommissionFilterSchema = z.object({
  userId: z.string().optional(),
  referralId: z.string().optional(),
  orderId: z.string().optional(),
  level: z.number().int().min(1).max(3).optional(),
  status: z.enum(["pending", "approved", "paid", "cancelled"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  sortBy: z.enum(["createdAt", "commissionAmount", "level", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Update commission status schema
export const UpdateCommissionStatusSchema = z.object({
  status: z.enum(["approved", "cancelled"]),
  notes: z.string().optional(),
});

// Create payout schema
export const CreatePayoutSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  commissionIds: z.array(z.string()).min(1, "At least one commission ID is required"),
  paymentMethod: z.enum(["bank_transfer", "paypal", "crypto", "store_credit"]),
  paymentDetails: z.record(z.any()),
  notes: z.string().optional(),
});

// Update payout status schema
export const UpdatePayoutStatusSchema = z.object({
  status: z.enum(["processing", "completed", "failed", "cancelled"]),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  failureReason: z.string().optional(),
});

// Payout filter schema
export const PayoutFilterSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]).optional(),
  paymentMethod: z.enum(["bank_transfer", "paypal", "crypto", "store_credit"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// MLM rank schema
export const CreateMLMRankSchema = z.object({
  name: z.string().min(2, "Rank name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.object({
    minReferrals: z.number().int().min(0),
    minMonthlyVolume: z.number().min(0),
    minTeamSize: z.number().int().min(0),
  }),
  benefits: z.object({
    bonusRate: z.number().min(0).max(100),
    extraCommission: z.number().min(0).max(100),
    perks: z.array(z.string()),
  }),
  isActive: z.boolean().default(true),
});

export const UpdateMLMRankSchema = CreateMLMRankSchema.partial();

// Referral filter schema
export const ReferralFilterSchema = z.object({
  referrerId: z.string().optional(),
  referredId: z.string().optional(),
  level: z.number().int().min(1).max(3).optional(),
  isActive: z.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "level", "totalCommissionEarned"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type MLMSettingsDTO = z.infer<typeof MLMSettingsSchema>;
export type UpdateMLMSettingsDTO = z.infer<typeof UpdateMLMSettingsSchema>;
export type CreateReferralDTO = z.infer<typeof CreateReferralSchema>;
export type CommissionFilterDTO = z.infer<typeof CommissionFilterSchema>;
export type UpdateCommissionStatusDTO = z.infer<typeof UpdateCommissionStatusSchema>;
export type CreatePayoutDTO = z.infer<typeof CreatePayoutSchema>;
export type UpdatePayoutStatusDTO = z.infer<typeof UpdatePayoutStatusSchema>;
export type PayoutFilterDTO = z.infer<typeof PayoutFilterSchema>;
export type CreateMLMRankDTO = z.infer<typeof CreateMLMRankSchema>;
export type UpdateMLMRankDTO = z.infer<typeof UpdateMLMRankSchema>;
export type ReferralFilterDTO = z.infer<typeof ReferralFilterSchema>;
