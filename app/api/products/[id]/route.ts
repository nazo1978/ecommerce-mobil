import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../../../backend/business/product.service';
import { ProductRepository } from '../../../../backend/repositories/product.repository';
import { UserRepository } from '../../../../backend/repositories/user.repository';
import { updateProductSchema } from '../../../../backend/validation/product.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler, NotFoundError } from '../../../../backend/utils/errors';

// Initialize services
const productRepository = new ProductRepository();
const userRepository = new UserRepository();
const productService = new ProductService(productRepository, userRepository, userRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productService.getById(params.id);
    
    if (!product) {
      throw new NotFoundError('Product', params.id);
    }

    // Increment view count
    await productRepository.incrementViewCount(params.id);

    return NextResponse.json(formatSuccessResponse(product));
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateProductSchema.parse(body);
    
    // Update product
    const product = await productService.update(params.id, validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(product, 'Product updated successfully')
    );
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await productService.delete(params.id);
    
    return NextResponse.json(
      formatSuccessResponse(null, 'Product deleted successfully')
    );
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}
