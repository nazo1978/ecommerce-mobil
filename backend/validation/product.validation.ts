import { z } from "zod";

// Base schemas
export const ProductDimensionsSchema = z.object({
  length: z.number().positive("Length must be positive"),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  unit: z.enum(["cm", "in"]).default("cm"),
});

export const ProductImageSchema = z.object({
  url: z.string().url("Valid image URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  position: z.number().int().min(0),
  isMain: z.boolean().default(false),
});

export const ProductVideoSchema = z.object({
  url: z.string().url("Valid video URL is required"),
  title: z.string().min(1, "Video title is required"),
  position: z.number().int().min(0),
});

export const VariantAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
});

export const ProductVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  image: z.string().url().optional(),
  attributes: z.array(VariantAttributeSchema),
  isActive: z.boolean().default(true),
});

// Product creation and update schemas
export const CreateProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be non-negative"),
  comparePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  minStock: z.number().int().min(0).default(0),
  weight: z.number().positive().optional(),
  dimensions: ProductDimensionsSchema.optional(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  images: z.array(ProductImageSchema).min(1, "At least one image is required"),
  videos: z.array(ProductVideoSchema).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isDigital: z.boolean().default(false),
  hasVariants: z.boolean().default(false),
  variants: z.array(ProductVariantSchema).default([]),
  requiresShipping: z.boolean().default(true),
  shippingClass: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const UpdateProductStatusSchema = z.object({
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const UpdateProductStockSchema = z.object({
  stock: z.number().int().min(0, "Stock must be non-negative"),
  minStock: z.number().int().min(0).optional(),
});

// Category schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  parentId: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().default(true),
  position: z.number().int().min(0).default(0),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// Product filter schemas
export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["name", "price", "createdAt", "updatedAt", "salesCount", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
export type UpdateProductStatusDTO = z.infer<typeof UpdateProductStatusSchema>;
export type UpdateProductStockDTO = z.infer<typeof UpdateProductStockSchema>;
export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
export type ProductFilterDTO = z.infer<typeof ProductFilterSchema>;
export type ProductDimensionsDTO = z.infer<typeof ProductDimensionsSchema>;
export type ProductImageDTO = z.infer<typeof ProductImageSchema>;
export type ProductVideoDTO = z.infer<typeof ProductVideoSchema>;
export type ProductVariantDTO = z.infer<typeof ProductVariantSchema>;
export type VariantAttributeDTO = z.infer<typeof VariantAttributeSchema>;
