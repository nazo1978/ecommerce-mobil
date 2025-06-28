import { z } from "zod";

// Base schemas
export const AddressSchema = z.object({
  title: z.string().min(1, "Address title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  isDefault: z.boolean().default(false),
});

export const UserPreferencesSchema = z.object({
  language: z.string().default("tr"),
  currency: z.string().default("TRY"),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false),
  }),
  privacy: z.object({
    showProfile: z.boolean().default(true),
    showActivity: z.boolean().default(false),
  }),
});

// User creation and update schemas
export const CreateUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  role: z.enum(["user", "seller", "admin"]).default("user"),
  referralCode: z.string().optional(),
  preferences: UserPreferencesSchema.optional(),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  preferences: UserPreferencesSchema.optional(),
});

export const UpdateUserRoleSchema = z.object({
  role: z.enum(["user", "seller", "admin"]),
});

export const CreateAddressSchema = AddressSchema;
export const UpdateAddressSchema = AddressSchema.partial();

// Vendor schemas
export const CreateVendorSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(1, "Business type is required"),
  taxNumber: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
});

export const UpdateVendorSchema = CreateVendorSchema.partial();

// Type exports
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UpdateUserRoleDTO = z.infer<typeof UpdateUserRoleSchema>;
export type CreateAddressDTO = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressDTO = z.infer<typeof UpdateAddressSchema>;
export type CreateVendorDTO = z.infer<typeof CreateVendorSchema>;
export type UpdateVendorDTO = z.infer<typeof UpdateVendorSchema>;
export type UserPreferencesDTO = z.infer<typeof UserPreferencesSchema>;
export type AddressDTO = z.infer<typeof AddressSchema>;
