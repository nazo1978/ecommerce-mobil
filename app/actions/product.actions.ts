'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProductService } from '../../backend/business/product.service';
import { ProductRepository } from '../../backend/repositories/product.repository';
import { UserRepository } from '../../backend/repositories/user.repository';
import { createProductSchema, updateProductSchema } from '../../backend/validation/product.validation';
import { ErrorHandler } from '../../backend/utils/errors';

// Initialize services
const productRepository = new ProductRepository();
const userRepository = new UserRepository();
const productService = new ProductService(productRepository, userRepository, userRepository);

export async function createProduct(vendorId: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      price: parseFloat(formData.get('price') as string),
      comparePrice: formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : undefined,
      stock: parseInt(formData.get('stock') as string),
      categoryId: formData.get('categoryId') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : [],
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      isDigital: formData.get('isDigital') === 'true',
      requiresShipping: formData.get('requiresShipping') === 'true',
    };

    // Validate data
    const validatedData = createProductSchema.parse(data);

    // Create product
    const product = await productService.createProduct(vendorId, validatedData);

    revalidatePath('/seller/products');
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      price: parseFloat(formData.get('price') as string),
      comparePrice: formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : undefined,
      stock: parseInt(formData.get('stock') as string),
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()) : [],
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
      isDigital: formData.get('isDigital') === 'true',
      requiresShipping: formData.get('requiresShipping') === 'true',
    };

    // Remove empty values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== null && !isNaN(value as any))
    );

    // Validate data
    const validatedData = updateProductSchema.parse(cleanData);

    // Update product
    const product = await productService.update(productId, validatedData);

    revalidatePath('/seller/products');
    revalidatePath(`/seller/products/${productId}`);
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await productService.delete(productId);

    revalidatePath('/seller/products');
    return { success: true };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function publishProduct(productId: string) {
  try {
    const product = await productRepository.publish(productId);

    revalidatePath('/seller/products');
    revalidatePath(`/seller/products/${productId}`);
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function unpublishProduct(productId: string) {
  try {
    const product = await productRepository.unpublish(productId);

    revalidatePath('/seller/products');
    revalidatePath(`/seller/products/${productId}`);
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function setProductFeatured(productId: string, featured: boolean) {
  try {
    const product = await productRepository.setFeatured(productId, featured);

    revalidatePath('/admin/products');
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function updateProductStock(productId: string, quantity: number) {
  try {
    const product = await productRepository.updateStock(productId, quantity);

    revalidatePath('/seller/products');
    revalidatePath(`/seller/products/${productId}`);
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function duplicateProduct(productId: string) {
  try {
    const originalProduct = await productService.getById(productId);
    if (!originalProduct) {
      throw new Error('Product not found');
    }

    // Create a copy with modified name and SKU
    const duplicateData = {
      ...originalProduct,
      name: `${originalProduct.name} (Copy)`,
      sku: `${originalProduct.sku}-copy-${Date.now()}`,
      isPublished: false,
    };

    // Remove fields that shouldn't be copied
    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.viewCount;
    delete duplicateData.salesCount;
    delete duplicateData.rating;
    delete duplicateData.reviewCount;

    const product = await productService.createProduct(originalProduct.vendorId, duplicateData);

    revalidatePath('/seller/products');
    return { success: true, data: product };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}
