import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../backend/business/product.service';
import { ProductRepository } from '../../../backend/repositories/product.repository';
import { UserRepository } from '../../../backend/repositories/user.repository';
import { CreateProductSchema, ProductFilterSchema } from '../../../backend/validation/product.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler } from '../../../backend/utils/errors';
import { PAGINATION } from '../../../backend/utils/constants';

// Initialize services
const productRepository = new ProductRepository();
const userRepository = new UserRepository();
const productService = new ProductService(productRepository, userRepository, userRepository); // Using userRepository as placeholder for category and vendor repos

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString());
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const vendorId = searchParams.get('vendorId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');

    // Build filters
    const filters = ProductFilterSchema.parse({
      ...(categoryId && { categoryId }),
      ...(vendorId && { vendorId }),
      ...(minPrice && { priceMin: parseFloat(minPrice) }),
      ...(maxPrice && { priceMax: parseFloat(maxPrice) }),
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortOrder: sortDirection as 'asc' | 'desc' }),
      ...(inStock && { inStock: inStock === 'true' }),
      page,
      limit,
    });

    let products;

    if (search) {
      products = await productRepository.searchProducts(search, filters, limit);
    } else if (featured === 'true') {
      products = await productRepository.findFeatured(limit);
    } else if (categoryId) {
      products = await productRepository.findByCategory(categoryId, limit);
    } else if (vendorId) {
      products = await productRepository.findByVendor(vendorId, limit);
    } else {
      products = await productRepository.findPublished(limit, (page - 1) * limit);
    }

    const total = await productRepository.count({
      isActive: true,
      isPublished: true,
      ...(categoryId && { 'category._ref': categoryId }),
      ...(vendorId && { 'vendor._ref': vendorId }),
    });

    const response = {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };

    return NextResponse.json(formatSuccessResponse(response));
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateProductSchema.parse(body);
    
    // Get vendor ID from request (this would typically come from authentication)
    const vendorId = request.headers.get('x-vendor-id');
    if (!vendorId) {
      throw new Error('Vendor ID is required');
    }
    
    // Create product
    const product = await productService.createProduct(vendorId, validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(product, 'Product created successfully'),
      { status: 201 }
    );
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}
