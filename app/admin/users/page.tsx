import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClerkClient } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireAuth, getRoleDisplayName, getRoleBadgeVariant } from '@/lib/clerk-utils'
import { UserRoleManager } from '@/components/admin/user-role-manager'

export default async function AdminUsersPage() {
  try {
    // Require admin authentication
    await requireAuth('admin')
  } catch (error) {
    redirect('/sign-in?error=unauthorized')
  }

  // Get all users from Clerk
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  const usersResponse = await clerkClient.users.getUserList({
    limit: 50,
    orderBy: '-created_at',
  })

  // Extract users array from response
  const users = usersResponse.data || usersResponse || []

  console.log('Users response:', { usersResponse, users, type: typeof users, isArray: Array.isArray(users) })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            Sistemdeki tüm kullanıcıları görüntüleyin ve rollerini yönetin.
          </p>
        </div>

        <div className="grid gap-6">
          {Array.isArray(users) && users.length > 0 ? users.map((user) => {
            const role = (user.publicMetadata?.role as 'user' | 'seller' | 'admin') || 'user'
            const email = user.emailAddresses[0]?.emailAddress || 'Email yok'
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'İsim yok'

            return (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user.imageUrl && (
                        <img
                          src={user.imageUrl}
                          alt={name}
                          className="h-12 w-12 rounded-full"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{name}</CardTitle>
                        <CardDescription>{email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(role)}>
                        {getRoleDisplayName(role)}
                      </Badge>
                      <UserRoleManager userId={user.id} currentRole={role} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Kullanıcı ID:</span>
                      <p className="font-mono text-xs">{user.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Kayıt Tarihi:</span>
                      <p>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Son Giriş:</span>
                      <p>
                        {user.lastSignInAt 
                          ? new Date(user.lastSignInAt).toLocaleDateString('tr-TR')
                          : 'Hiç giriş yapmamış'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email Doğrulandı:</span>
                      <p>
                        {user.emailAddresses[0]?.verification?.status === 'verified' 
                          ? '✅ Evet' 
                          : '❌ Hayır'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Henüz kullanıcı bulunmuyor.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
