import { ERROR_CODES } from './constants';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR);
    this.field = field;
    this.value = value;
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, ERROR_CODES.UNAUTHORIZED);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, ERROR_CODES.FORBIDDEN);
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, ERROR_CODES.CONFLICT);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, ERROR_CODES.RATE_LIMIT);
  }
}

/**
 * Business logic error
 */
export class BusinessLogicError extends AppError {
  constructor(message: string) {
    super(message, 422, ERROR_CODES.VALIDATION_ERROR);
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  static handle(error: Error): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return new ValidationError(error.message);
    }

    if (error.name === 'CastError') {
      return new ValidationError('Invalid ID format');
    }

    if (error.name === 'MongoError' && (error as any).code === 11000) {
      return new ConflictError('Duplicate key error');
    }

    // Default to internal server error
    return new AppError(
      'Internal server error',
      500,
      ERROR_CODES.INTERNAL_ERROR,
      false
    );
  }

  static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

/**
 * Async error wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Error response formatter
 */
export const formatErrorResponse = (error: AppError) => {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...(error instanceof ValidationError && {
        field: error.field,
        value: error.value,
      }),
    },
  };
};

/**
 * Success response formatter
 */
export const formatSuccessResponse = <T>(data: T, message?: string) => {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
};
