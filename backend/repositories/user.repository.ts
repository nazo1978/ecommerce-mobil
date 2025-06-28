import { BaseRepository } from './base.repository';
import { User } from '../entities/user.entity';
import { GROQ_QUERIES } from '../../lib/sanity/client';

export class UserRepository extends BaseRepository<User> {
  protected documentType = 'user';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.executeQuery(GROQ_QUERIES.GET_USER_BY_EMAIL, { email });
      return result ? this.mapSanityDoc(result) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findByReferralCode(referralCode: string): Promise<User | null> {
    try {
      const query = `*[_type == "user" && referralCode == $referralCode][0]`;
      const result = await this.executeQuery(query, { referralCode });
      return result ? this.mapSanityDoc(result) : null;
    } catch (error) {
      console.error('Error finding user by referral code:', error);
      return null;
    }
  }

  async findByRole(role: string): Promise<User[]> {
    try {
      const query = `*[_type == "user" && role == $role]`;
      const results = await this.executeQuery(query, { role });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding users by role:', error);
      return [];
    }
  }

  async findActiveUsers(): Promise<User[]> {
    try {
      const query = `*[_type == "user" && isActive == true]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding active users:', error);
      return [];
    }
  }

  async findVerifiedUsers(): Promise<User[]> {
    try {
      const query = `*[_type == "user" && isEmailVerified == true]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding verified users:', error);
      return [];
    }
  }

  async findReferrals(userId: string): Promise<User[]> {
    try {
      const query = `*[_type == "user" && referredBy._ref == $userId]`;
      const results = await this.executeQuery(query, { userId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding user referrals:', error);
      return [];
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.update(userId, {
        lastLoginAt: new Date(),
      } as Partial<User>);
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  async verifyEmail(userId: string): Promise<User> {
    try {
      return await this.update(userId, {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      } as Partial<User>);
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  async verifyPhone(userId: string): Promise<User> {
    try {
      return await this.update(userId, {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
      } as Partial<User>);
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  }

  async promoteToSeller(userId: string): Promise<User> {
    try {
      return await this.update(userId, {
        role: 'seller',
      } as Partial<User>);
    } catch (error) {
      console.error('Error promoting user to seller:', error);
      throw error;
    }
  }

  async addAddress(userId: string, address: any): Promise<User> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const addresses = user.addresses || [];
      
      // If this is the first address or marked as default, make it default
      if (addresses.length === 0 || address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
        address.isDefault = true;
      }

      addresses.push(address);

      return await this.update(userId, {
        addresses,
      } as Partial<User>);
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  async updateAddress(userId: string, addressIndex: number, address: any): Promise<User> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const addresses = user.addresses || [];
      if (addressIndex < 0 || addressIndex >= addresses.length) {
        throw new Error('Address not found');
      }

      // If marking as default, unmark others
      if (address.isDefault) {
        addresses.forEach((addr, index) => {
          if (index !== addressIndex) {
            addr.isDefault = false;
          }
        });
      }

      addresses[addressIndex] = { ...addresses[addressIndex], ...address };

      return await this.update(userId, {
        addresses,
      } as Partial<User>);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async removeAddress(userId: string, addressIndex: number): Promise<User> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const addresses = user.addresses || [];
      if (addressIndex < 0 || addressIndex >= addresses.length) {
        throw new Error('Address not found');
      }

      const removedAddress = addresses[addressIndex];
      addresses.splice(addressIndex, 1);

      // If removed address was default and there are other addresses, make first one default
      if (removedAddress.isDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }

      return await this.update(userId, {
        addresses,
      } as Partial<User>);
    } catch (error) {
      console.error('Error removing address:', error);
      throw error;
    }
  }

  async updatePreferences(userId: string, preferences: any): Promise<User> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedPreferences = {
        ...user.preferences,
        ...preferences,
      };

      return await this.update(userId, {
        preferences: updatedPreferences,
      } as Partial<User>);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string, limit: number = 20): Promise<User[]> {
    try {
      const query = `*[_type == "user" && (
        firstName match $searchTerm ||
        lastName match $searchTerm ||
        email match $searchTerm
      )][0...${limit}]`;
      
      const results = await this.executeQuery(query, { 
        searchTerm: `*${searchTerm}*` 
      });
      
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const query = `{
        "user": *[_type == "user" && _id == $userId][0],
        "referralCount": count(*[_type == "user" && referredBy._ref == $userId]),
        "orderCount": count(*[_type == "order" && user._ref == $userId]),
        "totalSpent": sum(*[_type == "order" && user._ref == $userId && status == "completed"].total)
      }`;
      
      return await this.executeQuery(query, { userId });
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}
