/**
 * Common types used across the application
 */

export type ID = string;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletableEntity extends TimestampedEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface AuditableEntity extends TimestampedEntity {
  createdBy?: ID;
  updatedBy?: ID;
}

export type UserRole = "user" | "seller" | "admin";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type AuctionStatus = "upcoming" | "live" | "ended" | "cancelled";

export type GiveawayStatus = "upcoming" | "active" | "ended" | "cancelled";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  vendorId?: string;
  status?: string;
}
