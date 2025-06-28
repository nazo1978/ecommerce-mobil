import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../backend/business/user.service';
import { UserRepository } from '../../../../backend/repositories/user.repository';
import { updateUserSchema } from '../../../../backend/validation/user.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler, NotFoundError } from '../../../../backend/utils/errors';

// Initialize services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.getById(params.id);
    
    if (!user) {
      throw new NotFoundError('User', params.id);
    }

    return NextResponse.json(formatSuccessResponse(user));
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
    const validatedData = updateUserSchema.parse(body);
    
    // Update user
    const user = await userService.update(params.id, validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(user, 'User updated successfully')
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
    await userService.delete(params.id);
    
    return NextResponse.json(
      formatSuccessResponse(null, 'User deleted successfully')
    );
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return NextResponse.json(
      formatErrorResponse(appError),
      { status: appError.statusCode }
    );
  }
}
