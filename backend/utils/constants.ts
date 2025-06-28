/**
 * Application constants
 */

// User roles
export const USER_ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Auction statuses
export const AUCTION_STATUSES = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

// Giveaway statuses
export const GIVEAWAY_STATUSES = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

// MLM settings
export const MLM_CONSTANTS = {
  MAX_LEVELS: 3,
  DEFAULT_LEVEL_1_RATE: 5, // 5%
  DEFAULT_LEVEL_2_RATE: 3, // 3%
  DEFAULT_LEVEL_3_RATE: 2, // 2%
  MIN_PAYOUT_AMOUNT: 100, // 100 TRY
  PAYOUT_FREQUENCIES: {
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
  },
} as const;

// Commission statuses
export const COMMISSION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

// Payout statuses
export const PAYOUT_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  CRYPTO: 'crypto',
  STORE_CREDIT: 'store_credit',
} as const;

// Currencies
export const CURRENCIES = {
  TRY: 'TRY',
  USD: 'USD',
  EUR: 'EUR',
} as const;

// Languages
export const LANGUAGES = {
  TR: 'tr',
  EN: 'en',
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Time constants
export const TIME_CONSTANTS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

// Auction settings
export const AUCTION_SETTINGS = {
  MIN_BID_INCREMENT: 1,
  MAX_EXTENSION_TIME: 60, // minutes
  MAX_EXTENSIONS: 10,
  DEFAULT_EXTENSION_TIME: 5, // minutes
  PAYMENT_DUE_DAYS: 7,
} as const;

// Giveaway settings
export const GIVEAWAY_SETTINGS = {
  MIN_ENTRY_PRICE: 0,
  MAX_PARTICIPANTS_DEFAULT: 1000,
  REQUIREMENT_TYPES: {
    FOLLOW: 'follow',
    SHARE: 'share',
    TAG_FRIENDS: 'tag_friends',
    VISIT_STORE: 'visit_store',
    PURCHASE_MINIMUM: 'purchase_minimum',
  },
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  AUCTION_CREATED: 'Auction created successfully',
  BID_PLACED: 'Bid placed successfully',
  GIVEAWAY_CREATED: 'Giveaway created successfully',
  ENTRY_SUBMITTED: 'Entry submitted successfully',
} as const;

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  ORDER_CONFIRMATION: 'order_confirmation',
  AUCTION_WON: 'auction_won',
  GIVEAWAY_WON: 'giveaway_won',
  MLM_COMMISSION: 'mlm_commission',
} as const;
