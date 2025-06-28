import { BaseEntity, OrderStatus, PaymentStatus, ID } from '../core/types/common';
import { Address } from './user.entity';

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: ID;
  
  // Order details
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  
  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Addresses
  billingAddress: Address;
  shippingAddress: Address;
  
  // Shipping
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  
  // Payment
  paymentMethod?: string;
  paymentId?: string;
  paidAt?: Date;
  
  // Discounts and coupons
  couponCode?: string;
  couponDiscount?: number;
  
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  
  // Timestamps
  confirmedAt?: Date;
  shippedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
}

export interface OrderItem {
  id: ID;
  productId: ID;
  variantId?: ID;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  
  // Product details at time of order
  productSnapshot: {
    name: string;
    description: string;
    image: string;
    vendorId: ID;
    vendorName: string;
  };
}

export interface OrderHistory {
  id: ID;
  orderId: ID;
  status: OrderStatus;
  note?: string;
  createdBy?: ID;
  createdAt: Date;
}

export interface Refund {
  id: ID;
  orderId: ID;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedBy: ID;
  processedBy?: ID;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
