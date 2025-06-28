import { BaseEntity, ID } from '../core/types/common';

export interface Product extends BaseEntity {
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: ProductDimensions;
  
  // Vendor information
  vendorId: ID;
  vendor?: Vendor;
  
  // Category and tags
  categoryId: ID;
  category?: Category;
  tags: string[];
  
  // Media
  images: ProductImage[];
  videos?: ProductVideo[];
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  
  // Status and visibility
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  
  // Variants
  hasVariants: boolean;
  variants: ProductVariant[];
  
  // Shipping
  requiresShipping: boolean;
  shippingClass?: string;
  
  // Metadata
  publishedAt?: Date;
  viewCount: number;
  salesCount: number;
  rating: number;
  reviewCount: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductImage {
  id: ID;
  url: string;
  alt: string;
  position: number;
  isMain: boolean;
}

export interface ProductVideo {
  id: ID;
  url: string;
  title: string;
  position: number;
}

export interface ProductVariant {
  id: ID;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  attributes: VariantAttribute[];
  isActive: boolean;
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface Category {
  id: ID;
  name: string;
  description?: string;
  slug: string;
  parentId?: ID;
  image?: string;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: ID;
  userId: ID;
  businessName: string;
  businessType: string;
  taxNumber?: string;
  description?: string;
  logo?: string;
  banner?: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}
