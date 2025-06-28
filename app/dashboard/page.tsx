import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get user role from metadata
  const userRole = user?.publicMetadata?.role as string || 'user'
  const userRoleDisplay = {
    user: 'Kullanıcı',
    seller: 'Satıcı', 
    admin: 'Yönetici'
  }[userRole] || 'Kullanıcı'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş geldiniz, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-gray-600 mt-2">
            Hesap durumunuz ve işlemlerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
              <CardDescription>Kullanıcı detayları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{user?.emailAddresses[0]?.emailAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rol:</span>
                  <Badge variant={userRole === 'admin' ? 'destructive' : userRole === 'seller' ? 'default' : 'secondary'}>
                    {userRoleDisplay}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Üyelik:</span>
                  <span className="text-sm font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan özellikler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href="/products">Ürünleri Görüntüle</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/auctions">Müzayedeleri Görüntüle</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/profile">Profili Düzenle</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Role-specific Actions */}
          {(userRole === 'seller' || userRole === 'admin') && (
            <Card>
              <CardHeader>
                <CardTitle>Satıcı İşlemleri</CardTitle>
                <CardDescription>Satış yönetimi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/seller/products">Ürünlerimi Yönet</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/seller/auctions">Müzayedelerimi Yönet</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/seller/orders">Siparişlerimi Görüntüle</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {userRole === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Yönetici İşlemleri</CardTitle>
                <CardDescription>Sistem yönetimi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin/users">Kullanıcı Yönetimi</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin/products">Ürün Yönetimi</Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/studio">Sanity Studio</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>Hesabınızdaki son işlemler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Henüz aktivite bulunmuyor.</p>
              <p className="text-sm mt-2">İlk işleminizi yapmak için yukarıdaki bağlantıları kullanın.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
