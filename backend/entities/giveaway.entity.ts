import { BaseEntity, GiveawayStatus, ID } from '../core/types/common';

export interface Giveaway extends BaseEntity {
  title: string;
  description: string;
  productId: ID;
  vendorId: ID;
  
  // Giveaway settings
  maxParticipants?: number;
  entryPrice: number; // 0 for free giveaways
  currency: string;
  
  // Timing
  startAt: Date;
  endAt: Date;
  status: GiveawayStatus;
  
  // Current state
  participantCount: number;
  totalRevenue: number;
  winnerId?: ID;
  winnerSelectedAt?: Date;
  
  // Entry requirements
  requirements: GiveawayRequirement[];
  
  // Visibility
  isPublic: boolean;
  isFeatured: boolean;
  
  // Images
  images: string[];
  
  // Rules and terms
  rules: string;
  terms: string;
  
  // Metadata
  viewCount: number;
  shareCount: number;
  
  // Completion
  completedAt?: Date;
  prizeDeliveredAt?: Date;
}

export interface GiveawayRequirement {
  type: 'follow' | 'share' | 'tag_friends' | 'visit_store' | 'purchase_minimum';
  description: string;
  value?: string | number;
  isRequired: boolean;
}

export interface GiveawayEntry extends BaseEntity {
  giveawayId: ID;
  userId: ID;
  entryMethod: 'paid' | 'free' | 'referral';
  paymentId?: string;
  referredBy?: ID;
  
  // Entry validation
  requirementsMet: boolean;
  validatedAt?: Date;
  
  // Metadata
  userAgent?: string;
  ipAddress?: string;
}

export interface GiveawayWinner {
  id: ID;
  giveawayId: ID;
  userId: ID;
  entryId: ID;
  selectedAt: Date;
  notifiedAt?: Date;
  prizeClaimedAt?: Date;
  prizeDeliveredAt?: Date;
  
  // Prize details
  prizeValue: number;
  deliveryAddress?: any; // Address type
  trackingNumber?: string;
}

export interface GiveawayActivity {
  id: ID;
  giveawayId: ID;
  type: 'entry' | 'share' | 'start' | 'end' | 'winner_selected' | 'prize_delivered';
  userId?: ID;
  data: Record<string, any>;
  createdAt: Date;
}
