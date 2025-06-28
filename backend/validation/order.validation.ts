import { z } from "zod";
import { AddressSchema } from "./user.validation";

// Order item schema
export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

// Create order schema
export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema,
  shippingMethod: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

// Update order schema
export const UpdateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  adminNotes: z.string().optional(),
});

// Order status update schema
export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]),
  note: z.string().optional(),
});

// Payment update schema
export const UpdatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["pending", "completed", "failed", "refunded"]),
  paymentId: z.string().optional(),
  paidAt: z.string().datetime().optional(),
});

// Refund request schema
export const CreateRefundSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().min(0, "Amount must be non-negative"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

// Process refund schema
export const ProcessRefundSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().optional(),
});

// Order filter schema
export const OrderFilterSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(), // Search by order number or customer name
  sortBy: z.enum(["createdAt", "updatedAt", "totalAmount", "orderNumber"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Shipping update schema
export const UpdateShippingSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  shippingMethod: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

// Type exports
export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderDTO = z.infer<typeof UpdateOrderSchema>;
export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusSchema>;
export type UpdatePaymentStatusDTO = z.infer<typeof UpdatePaymentStatusSchema>;
export type CreateRefundDTO = z.infer<typeof CreateRefundSchema>;
export type ProcessRefundDTO = z.infer<typeof ProcessRefundSchema>;
export type OrderFilterDTO = z.infer<typeof OrderFilterSchema>;
export type UpdateShippingDTO = z.infer<typeof UpdateShippingSchema>;
export type OrderItemDTO = z.infer<typeof OrderItemSchema>;
