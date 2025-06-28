import { BaseService } from './base.service';
import { User, UserStats, Vendor } from '../entities/user.entity';
import { IRepository } from '../core/interfaces';
import { CreateUserDTO, UpdateUserDTO, CreateVendorDTO } from '../validation/user.validation';

export class UserService extends BaseService<User> {
  constructor(
    userRepository: IRepository<User>,
    private vendorRepository: IRepository<Vendor>
  ) {
    super(userRepository);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generate referral code
    const referralCode = await this.generateReferralCode();

    // Process referral if provided
    let referredBy: string | undefined;
    if (data.referralCode) {
      const referrer = await this.findByReferralCode(data.referralCode);
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const userData = {
      ...data,
      referralCode,
      referredBy,
      isActive: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      mlmLevel: 1,
      totalEarnings: 0,
      addresses: [],
      preferences: data.preferences || {
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
    };

    return this.create(userData);
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    return this.update(id, data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.repository.findBy({ email });
    return users[0] || null;
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    const users = await this.repository.findBy({ referralCode });
    return users[0] || null;
  }

  async getUserStats(userId: string): Promise<UserStats> {
    // This would typically involve aggregating data from multiple sources
    // For now, returning a basic structure
    return {
      userId,
      totalOrders: 0,
      totalSpent: 0,
      totalAuctionWins: 0,
      totalGiveawayWins: 0,
      mlmReferrals: 0,
      mlmEarnings: 0,
    };
  }

  async promoteToSeller(userId: string, vendorData: CreateVendorDTO): Promise<Vendor> {
    // Update user role
    await this.update(userId, { role: 'seller' });

    // Create vendor profile
    const vendor = await this.vendorRepository.create({
      ...vendorData,
      userId,
      isVerified: false,
      isActive: true,
      rating: 0,
      reviewCount: 0,
      totalSales: 0,
    });

    return vendor;
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.update(userId, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
  }

  async verifyPhone(userId: string): Promise<void> {
    await this.update(userId, {
      isPhoneVerified: true,
      phoneVerifiedAt: new Date(),
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: false });
  }

  async activateUser(userId: string): Promise<void> {
    await this.update(userId, { isActive: true });
  }

  async getReferrals(userId: string): Promise<User[]> {
    return this.repository.findBy({ referredBy: userId });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLoginAt: new Date() });
  }

  private async generateReferralCode(): Promise<string> {
    let code: string;
    let isUnique = false;

    do {
      code = this.generateRandomCode(8);
      const existing = await this.findByReferralCode(code);
      isUnique = !existing;
    } while (!isUnique);

    return code;
  }

  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  protected async validateCreate(data: Partial<User>): Promise<void> {
    if (!data.email) {
      throw new Error('Email is required');
    }

    if (!data.firstName || !data.lastName) {
      throw new Error('First name and last name are required');
    }
  }

  protected async afterCreate(user: User): Promise<void> {
    // Send welcome email, create default preferences, etc.
    console.log(`User created: ${user.email}`);
  }
}
