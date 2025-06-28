import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { UserRepository } from '@/backend/repositories/user.repository'

const userRepository = new UserRepository()

export type UserRole = 'user' | 'seller' | 'admin'

/**
 * Get current user's role from Clerk metadata
 */
export async function getCurrentUserRole(): Promise<UserRole> {
  const user = await currentUser()
  return (user?.publicMetadata?.role as UserRole) || 'user'
}

/**
 * Check if current user has required role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  
  // Admin has access to everything
  if (userRole === 'admin') return true
  
  // Seller has access to seller and user features
  if (userRole === 'seller' && (requiredRole === 'seller' || requiredRole === 'user')) {
    return true
  }
  
  // User only has access to user features
  return userRole === requiredRole
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin')
}

/**
 * Check if current user is seller or admin
 */
export async function isSeller(): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  return userRole === 'seller' || userRole === 'admin'
}

/**
 * Update user role in Clerk
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    })

    // Also update in our database
    const user = await clerkClient.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress
    
    if (email) {
      const dbUser = await userRepository.findByEmail(email)
      if (dbUser) {
        await userRepository.update(dbUser.id, { role })
      }
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

/**
 * Get user role display name in Turkish
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    user: 'Kullanıcı',
    seller: 'Satıcı',
    admin: 'Yönetici',
  }
  return roleNames[role] || 'Kullanıcı'
}

/**
 * Get role badge variant for UI
 */
export function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' {
  switch (role) {
    case 'admin':
      return 'destructive'
    case 'seller':
      return 'default'
    case 'user':
    default:
      return 'secondary'
  }
}

/**
 * Require authentication and specific role
 */
export async function requireAuth(requiredRole?: UserRole) {
  const user = await currentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  if (requiredRole) {
    const userRole = (user.publicMetadata?.role as UserRole) || 'user'
    if (userRole !== requiredRole) {
      throw new Error('Insufficient permissions')
    }
  }

  return user.id
}

/**
 * Get current user with role information
 */
export async function getCurrentUserWithRole() {
  const user = await currentUser()
  if (!user) return null

  const role = await getCurrentUserRole()
  
  return {
    ...user,
    role,
    roleDisplayName: getRoleDisplayName(role),
  }
}
