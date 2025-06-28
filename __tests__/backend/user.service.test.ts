import { UserService } from '@/backend/business/user.service';
import { IRepository } from '@/backend/core/interfaces';
import { User, Vendor } from '@/backend/entities/user.entity';

// Mock dependencies
const mockUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
} as jest.Mocked<IRepository<User>>;

const mockVendorRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
} as jest.Mocked<IRepository<Vendor>>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockUserRepository, mockVendorRepository);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: 'hashed_password',
      phone: '05551234567',
      role: 'user' as const,
    };

    it('should create user successfully', async () => {
      // Mock findBy to return empty array (no existing user)
      mockUserRepository.findBy.mockResolvedValue([]);

      const createdUser = {
        id: '1',
        ...userData,
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
        referralCode: 'ABC12345',
        mlmLevel: 1,
        totalEarnings: 0,
        addresses: [],
        preferences: {
          language: 'tr',
          currency: 'TRY',
          notifications: {
            email: true,
            sms: false,
            push: true,
            marketing: false,
          },
          privacy: {
            showProfile: true,
            showActivity: false,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        id: '1',
        email: userData.email,
        firstName: 'Existing',
        lastName: 'User',
      };

      mockUserRepository.findBy.mockResolvedValue([existingUser as any]);

      await expect(userService.createUser(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findBy.mockResolvedValue([user as any]);

      const result = await userService.findByEmail('test@example.com');

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findBy.mockResolvedValue([]);

      const result = await userService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const existingUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        ...existingUser,
        firstName: 'Updated',
        lastName: 'Name',
      };

      mockUserRepository.findById.mockResolvedValue(existingUser as any);
      mockUserRepository.update.mockResolvedValue(updatedUser as any);

      const result = await userService.updateUser('1', updateData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('verifyEmail', () => {
    it('should verify user email', async () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const verifiedUser = {
        ...existingUser,
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(existingUser as any);
      mockUserRepository.update.mockResolvedValue(verifiedUser as any);

      await userService.verifyEmail('1');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        isEmailVerified: true,
        emailVerifiedAt: expect.any(Date),
      });
    });
  });

  describe('verifyPhone', () => {
    it('should verify user phone', async () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const verifiedUser = {
        ...existingUser,
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(existingUser as any);
      mockUserRepository.update.mockResolvedValue(verifiedUser as any);

      await userService.verifyPhone('1');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        isPhoneVerified: true,
        phoneVerifiedAt: expect.any(Date),
      });
    });
  });
});
