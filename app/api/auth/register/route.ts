import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/backend/business/user.service';
import { UserRepository } from '@/backend/repositories/user.repository';
import { createUserSchema } from '@/backend/validation/user.validation';
import { ApiResponse } from '@/backend/utils/api-response';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return ApiResponse.badRequest(
        'Validation failed',
        validationResult.error.errors
      );
    }

    const userData = validationResult.data;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      return ApiResponse.conflict('User already exists', 'USER_EXISTS');
    }

    // Check if phone number is already in use
    if (userData.phone) {
      const existingPhone = await userRepository.findByPhone(userData.phone);
      if (existingPhone) {
        return ApiResponse.conflict('Phone number already in use', 'PHONE_EXISTS');
      }
    }

    // Create user
    const user = await userService.createUser({
      ...userData,
      role: 'user',
      authProvider: 'credentials',
    });

    // Remove sensitive data from response
    const { passwordHash, ...userResponse } = user;

    return ApiResponse.created('User created successfully', userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponse.internalServerError('Registration failed');
  }
}
