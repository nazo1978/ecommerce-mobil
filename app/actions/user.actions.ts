'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UserService } from '../../backend/business/user.service';
import { UserRepository } from '../../backend/repositories/user.repository';
import { createUserSchema, updateUserSchema } from '../../backend/validation/user.validation';
import { ErrorHandler } from '../../backend/utils/errors';

// Initialize services
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export async function createUser(formData: FormData) {
  try {
    const data = {
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string || 'user',
    };

    // Validate data
    const validatedData = createUserSchema.parse(data);

    // Create user
    const user = await userService.createUser(validatedData);

    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string,
    };

    // Remove empty values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== null)
    );

    // Validate data
    const validatedData = updateUserSchema.parse(cleanData);

    // Update user
    const user = await userService.update(userId, validatedData);

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    await userService.delete(userId);

    revalidatePath('/admin/users');
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

export async function verifyUserEmail(userId: string) {
  try {
    const user = await userRepository.verifyEmail(userId);

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function promoteToSeller(userId: string) {
  try {
    const user = await userRepository.promoteToSeller(userId);

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function addUserAddress(userId: string, formData: FormData) {
  try {
    const addressData = {
      title: formData.get('title') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string,
      district: formData.get('district') as string,
      address: formData.get('address') as string,
      postalCode: formData.get('postalCode') as string,
      isDefault: formData.get('isDefault') === 'true',
    };

    const user = await userRepository.addAddress(userId, addressData);

    revalidatePath(`/profile/addresses`);
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}

export async function updateUserPreferences(userId: string, formData: FormData) {
  try {
    const preferences = {
      language: formData.get('language') as string,
      currency: formData.get('currency') as string,
      notifications: {
        email: formData.get('emailNotifications') === 'true',
        sms: formData.get('smsNotifications') === 'true',
        push: formData.get('pushNotifications') === 'true',
        marketing: formData.get('marketingNotifications') === 'true',
      },
      privacy: {
        showProfile: formData.get('showProfile') === 'true',
        showActivity: formData.get('showActivity') === 'true',
      },
    };

    const user = await userRepository.updatePreferences(userId, preferences);

    revalidatePath(`/profile/settings`);
    return { success: true, data: user };
  } catch (error) {
    const appError = ErrorHandler.handle(error as Error);
    return { 
      success: false, 
      error: appError.message,
      code: appError.code 
    };
  }
}
