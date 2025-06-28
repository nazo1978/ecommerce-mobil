import { BaseEntity, AuctionStatus, ID } from '../core/types/common';

export interface Auction extends BaseEntity {
  title: string;
  description: string;
  productId: ID;
  vendorId: ID;
  
  // Auction settings
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  bidIncrement: number;
  
  // Timing
  startAt: Date;
  endAt: Date;
  status: AuctionStatus;
  
  // Current state
  currentPrice: number;
  bidCount: number;
  winningBidId?: ID;
  winnerId?: ID;
  
  // Settings
  autoExtend: boolean;
  extensionTime: number; // minutes
  maxExtensions: number;
  currentExtensions: number;
  
  // Visibility
  isPublic: boolean;
  isFeatured: boolean;
  
  // Images
  images: string[];
  
  // Metadata
  viewCount: number;
  watcherCount: number;
  
  // Completion
  completedAt?: Date;
  paymentDueAt?: Date;
  isPaid: boolean;
  paidAt?: Date;
}

export interface AuctionBid extends BaseEntity {
  auctionId: ID;
  userId: ID;
  amount: number;
  isWinning: boolean;
  isAutoBid: boolean;
  maxAmount?: number; // for auto bidding
  
  // Metadata
  userAgent?: string;
  ipAddress?: string;
}

export interface AuctionWatcher {
  id: ID;
  auctionId: ID;
  userId: ID;
  createdAt: Date;
}

export interface AuctionActivity {
  id: ID;
  auctionId: ID;
  type: 'bid' | 'watch' | 'unwatch' | 'start' | 'end' | 'extend';
  userId?: ID;
  data: Record<string, any>;
  createdAt: Date;
}

export interface AutoBidSettings {
  id: ID;
  userId: ID;
  auctionId: ID;
  maxAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
