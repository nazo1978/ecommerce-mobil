import { BaseEntity, ID } from '../core/types/common';

export interface MLMSettings extends BaseEntity {
  // Commission rates by level
  level1Rate: number; // Direct referral commission %
  level2Rate: number; // Second level commission %
  level3Rate: number; // Third level commission %
  
  // Limits and rules
  maxLevels: number;
  minOrderAmount: number; // Minimum order amount to earn commission
  maxMonthlyEarnings?: number; // Optional monthly earning cap
  
  // Payout settings
  minPayoutAmount: number;
  payoutFrequency: 'weekly' | 'monthly' | 'quarterly';
  payoutDay: number; // Day of week/month for payouts
  
  // Status
  isActive: boolean;
  
  // Terms
  terms: string;
  description: string;
}

export interface MLMReferral extends BaseEntity {
  referrerId: ID; // User who made the referral
  referredId: ID; // User who was referred
  referralCode: string;
  level: number; // 1, 2, or 3
  
  // Status
  isActive: boolean;
  activatedAt?: Date;
  
  // Stats
  totalOrders: number;
  totalOrderValue: number;
  totalCommissionEarned: number;
}

export interface MLMCommission extends BaseEntity {
  userId: ID; // User earning the commission
  referralId: ID; // The referral relationship
  orderId: ID; // Order that generated the commission
  
  // Commission details
  level: number;
  rate: number; // Commission rate applied
  orderAmount: number; // Original order amount
  commissionAmount: number; // Calculated commission
  
  // Status
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  
  // Processing
  approvedAt?: Date;
  approvedBy?: ID;
  paidAt?: Date;
  payoutId?: ID;
  
  // Metadata
  currency: string;
  notes?: string;
}

export interface MLMPayout extends BaseEntity {
  userId: ID;
  
  // Payout details
  amount: number;
  currency: string;
  commissionIds: ID[]; // Commissions included in this payout
  
  // Payment details
  paymentMethod: 'bank_transfer' | 'paypal' | 'crypto' | 'store_credit';
  paymentDetails: Record<string, any>;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  
  // Processing
  processedAt?: Date;
  processedBy?: ID;
  transactionId?: string;
  
  // Metadata
  notes?: string;
  failureReason?: string;
}

export interface MLMStats {
  userId: ID;
  
  // Referral stats
  totalReferrals: number;
  activeReferrals: number;
  level1Referrals: number;
  level2Referrals: number;
  level3Referrals: number;
  
  // Earnings stats
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  
  // Performance stats
  totalOrders: number;
  totalOrderValue: number;
  averageOrderValue: number;
  conversionRate: number;
  
  // Updated timestamp
  lastUpdated: Date;
}

export interface MLMRank {
  id: ID;
  name: string;
  description: string;
  requirements: {
    minReferrals: number;
    minMonthlyVolume: number;
    minTeamSize: number;
  };
  benefits: {
    bonusRate: number;
    extraCommission: number;
    perks: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMLMRank {
  id: ID;
  userId: ID;
  rankId: ID;
  achievedAt: Date;
  isActive: boolean;
  nextRankId?: ID;
  progressToNext: number; // Percentage progress to next rank
}
