import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { clerkClient } from '@clerk/nextjs/server'
import { UserRepository } from '@/backend/repositories/user.repository'
import { UserService } from '@/backend/business/user.service'

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data

  try {
    switch (eventType) {
      case 'user.created':
        // Create user in our database
        const userData = {
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || '',
          lastName: last_name || '',
          avatar: image_url,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          role: (public_metadata?.role as 'user' | 'seller' | 'admin') || 'user',
          authProvider: 'clerk',
        }

        const newUser = await userService.createUser(userData)
        
        // Update Clerk user with our internal user ID
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            ...public_metadata,
            internalUserId: newUser.id,
            role: userData.role,
          },
        })

        console.log('User created:', newUser.id)
        break

      case 'user.updated':
        // Update user in our database
        const existingUser = await userRepository.findByEmail(email_addresses[0]?.email_address || '')
        
        if (existingUser) {
          await userRepository.update(existingUser.id, {
            firstName: first_name || existingUser.firstName,
            lastName: last_name || existingUser.lastName,
            avatar: image_url || existingUser.avatar,
            role: (public_metadata?.role as 'user' | 'seller' | 'admin') || existingUser.role,
          })
          
          console.log('User updated:', existingUser.id)
        }
        break

      case 'user.deleted':
        // Soft delete user in our database
        const userToDelete = await userRepository.findByEmail(email_addresses[0]?.email_address || '')
        
        if (userToDelete) {
          await userRepository.update(userToDelete.id, {
            isActive: false,
          })
          
          console.log('User soft deleted:', userToDelete.id)
        }
        break

      default:
        console.log('Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
