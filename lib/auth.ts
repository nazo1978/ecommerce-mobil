import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { UserRepository } from '@/backend/repositories/user.repository';
import { UserService } from '@/backend/business/user.service';
import bcrypt from 'bcryptjs';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gereklidir');
        }

        try {
          // Find user by email
          const user = await userRepository.findByEmail(credentials.email);
          
          if (!user) {
            throw new Error('Kullanıcı bulunamadı');
          }

          if (!user.isActive) {
            throw new Error('Hesabınız deaktif durumda');
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValidPassword) {
            throw new Error('Geçersiz şifre');
          }

          // Update last login
          await userRepository.updateLastLogin(user.id);

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            image: user.avatar,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          let existingUser = await userRepository.findByEmail(user.email!);
          
          if (!existingUser) {
            // Create new user from Google profile
            const userData = {
              email: user.email!,
              firstName: profile?.given_name || user.name?.split(' ')[0] || '',
              lastName: profile?.family_name || user.name?.split(' ').slice(1).join(' ') || '',
              avatar: user.image,
              isEmailVerified: true,
              emailVerifiedAt: new Date(),
              role: 'user' as const,
              authProvider: 'google',
            };

            existingUser = await userService.createUser(userData);
          } else if (!existingUser.isActive) {
            throw new Error('Hesabınız deaktif durumda');
          }

          // Update last login
          await userRepository.updateLastLogin(existingUser.id);
          
          return true;
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.isEmailVerified = user.isEmailVerified;
        token.isPhoneVerified = user.isPhoneVerified;
      }

      // Refresh user data on each request
      if (token.email) {
        try {
          const dbUser = await userRepository.findByEmail(token.email);
          if (dbUser) {
            token.role = dbUser.role;
            token.isEmailVerified = dbUser.isEmailVerified;
            token.isPhoneVerified = dbUser.isPhoneVerified;
            token.name = `${dbUser.firstName} ${dbUser.lastName}`;
            token.picture = dbUser.avatar;
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.user.isPhoneVerified = token.isPhoneVerified as boolean;
      }
      
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};

// Type extensions for NextAuth
declare module 'next-auth' {
  interface User {
    role: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  }
}
