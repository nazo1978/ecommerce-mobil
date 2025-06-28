import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../backend/business/user.service';
import { UserRepository } from '../../../backend/repositories/user.repository';
import { createUserSchema } from '../../../backend/validation/user.validation';
import { formatErrorResponse, formatSuccessResponse, ErrorHandler } from '../../../backend/utils/errors';
import { PAGINATION } from '../../../backend/utils/constants';

// Initialize services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString());
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    // Build filters
    const filters: Record<string, any> = {};
    if (role) filters.role = role;
    if (isActive !== null) filters.isActive = isActive === 'true';

    let users;
    
    if (search) {
      users = await userRepository.searchUsers(search, limit);
    } else {
      const options = {
        limit,
        offset: (page - 1) * limit,
        orderBy: '_createdAt',
        orderDirection: 'desc' as const,
      };
      
      if (Object.keys(filters).length > 0) {
        users = await userRepository.findBy(filters);
      } else {
        users = await userRepository.findAll(options);
      }
    }

    const total = await userRepository.count(filters);

    const response = {
      users,
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
    const validatedData = createUserSchema.parse(body);
    
    // Create user
    const user = await userService.createUser(validatedData);
    
    return NextResponse.json(
      formatSuccessResponse(user, 'User created successfully'),
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
