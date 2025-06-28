import { BaseEntity, UserRole, ID } from '../core/types/common';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // Address information
  addresses: Address[];
  
  // MLM related fields
  referralCode?: string;
  referredBy?: ID;
  mlmLevel: number;
  totalEarnings: number;
  
  // Preferences
  preferences: UserPreferences;
  
  // Metadata
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
}

export interface Address {
  id: ID;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showProfile: boolean;
    showActivity: boolean;
  };
}

export interface UserStats {
  userId: ID;
  totalOrders: number;
  totalSpent: number;
  totalAuctionWins: number;
  totalGiveawayWins: number;
  mlmReferrals: number;
  mlmEarnings: number;
}
