import { z } from "zod";

// Create auction schema
export const CreateAuctionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  productId: z.string().min(1, "Product ID is required"),
  startingPrice: z.number().min(0.01, "Starting price must be greater than 0"),
  reservePrice: z.number().min(0).optional(),
  buyNowPrice: z.number().min(0).optional(),
  bidIncrement: z.number().min(0.01, "Bid increment must be greater than 0"),
  startAt: z.string().datetime("Invalid start date"),
  endAt: z.string().datetime("Invalid end date"),
  autoExtend: z.boolean().default(false),
  extensionTime: z.number().int().min(1).max(60).default(5), // minutes
  maxExtensions: z.number().int().min(0).max(10).default(3),
  isPublic: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
}).refine(
  (data) => new Date(data.endAt) > new Date(data.startAt),
  {
    message: "End date must be after start date",
    path: ["endAt"],
  }
).refine(
  (data) => !data.reservePrice || data.reservePrice >= data.startingPrice,
  {
    message: "Reserve price must be greater than or equal to starting price",
    path: ["reservePrice"],
  }
).refine(
  (data) => !data.buyNowPrice || data.buyNowPrice > data.startingPrice,
  {
    message: "Buy now price must be greater than starting price",
    path: ["buyNowPrice"],
  }
);

// Update auction schema
export const UpdateAuctionSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  reservePrice: z.number().min(0).optional(),
  buyNowPrice: z.number().min(0).optional(),
  endAt: z.string().datetime().optional(),
  autoExtend: z.boolean().optional(),
  extensionTime: z.number().int().min(1).max(60).optional(),
  maxExtensions: z.number().int().min(0).max(10).optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
});

// Place bid schema
export const PlaceBidSchema = z.object({
  amount: z.number().min(0.01, "Bid amount must be greater than 0"),
  isAutoBid: z.boolean().default(false),
  maxAmount: z.number().min(0).optional(),
}).refine(
  (data) => !data.isAutoBid || (data.maxAmount && data.maxAmount >= data.amount),
  {
    message: "Max amount must be greater than or equal to bid amount for auto bidding",
    path: ["maxAmount"],
  }
);

// Auto bid settings schema
export const AutoBidSettingsSchema = z.object({
  maxAmount: z.number().min(0.01, "Max amount must be greater than 0"),
  isActive: z.boolean().default(true),
});

// Auction filter schema
export const AuctionFilterSchema = z.object({
  status: z.enum(["upcoming", "live", "ended", "cancelled"]).optional(),
  vendorId: z.string().optional(),
  categoryId: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "startAt", "endAt", "currentPrice", "bidCount"]).default("startAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Update auction status schema
export const UpdateAuctionStatusSchema = z.object({
  status: z.enum(["upcoming", "live", "ended", "cancelled"]),
  note: z.string().optional(),
});

// Bid filter schema
export const BidFilterSchema = z.object({
  auctionId: z.string().optional(),
  userId: z.string().optional(),
  isWinning: z.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "amount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type CreateAuctionDTO = z.infer<typeof CreateAuctionSchema>;
export type UpdateAuctionDTO = z.infer<typeof UpdateAuctionSchema>;
export type PlaceBidDTO = z.infer<typeof PlaceBidSchema>;
export type AutoBidSettingsDTO = z.infer<typeof AutoBidSettingsSchema>;
export type AuctionFilterDTO = z.infer<typeof AuctionFilterSchema>;
export type UpdateAuctionStatusDTO = z.infer<typeof UpdateAuctionStatusSchema>;
export type BidFilterDTO = z.infer<typeof BidFilterSchema>;
