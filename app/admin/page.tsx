import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Package, 
  Gavel, 
  Gift, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Activity
} from 'lucide-react'

export default async function AdminDashboard() {
  // Kullanıcı giriş kontrolü ve rol kontrolü
  const user = await currentUser()

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    redirect('/sign-in')
  }

  // Admin rolü kontrolü
  const userRole = user.publicMetadata?.role
  if (userRole !== 'admin') {
    redirect('/')
  }

  // Mock data - gerçek uygulamada API'den gelecek
  const stats = {
    totalUsers: 156,
    totalProducts: 89,
    activeAuctions: 12,
    totalRevenue: 45670,
    monthlyGrowth: 12.5,
    pendingOrders: 23
  }

  const recentActivities = [
    { id: 1, type: 'user', message: 'Yeni kullanıcı kaydı: Ahmet Yılmaz', time: '5 dakika önce' },
    { id: 2, type: 'product', message: 'Yeni ürün eklendi: iPhone 15 Pro', time: '15 dakika önce' },
    { id: 3, type: 'auction', message: 'Müzayede başladı: Antika Saat', time: '1 saat önce' },
    { id: 4, type: 'order', message: 'Yeni sipariş: #12345', time: '2 saat önce' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          E-ticaret platformunuzun genel durumu ve istatistikleri
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% geçen aydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +5% geçen aydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Müzayede</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAuctions}</div>
            <p className="text-xs text-muted-foreground">
              +3 yeni müzayede
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyGrowth}% geçen aydan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Aktiviteler */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>
              Sistemdeki son aktiviteler ve değişiklikler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'user' && <Users className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'product' && <Package className="h-4 w-4 text-green-500" />}
                    {activity.type === 'auction' && <Gavel className="h-4 w-4 text-purple-500" />}
                    {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hızlı İşlemler */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>
              Sık kullanılan yönetim işlemleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <Package className="h-6 w-6 mb-2" />
                <span className="text-sm">Ürün Ekle</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Gavel className="h-6 w-6 mb-2" />
                <span className="text-sm">Müzayede Ekle</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Gift className="h-6 w-6 mb-2" />
                <span className="text-sm">Çekiliş Ekle</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Kullanıcı Yönet</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistem Durumu */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Durumu</CardTitle>
          <CardDescription>
            Platform performansı ve sistem sağlığı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Sistem Durumu</p>
                <p className="text-xs text-gray-500">Çevrimiçi ve Stabil</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Performans</p>
                <p className="text-xs text-gray-500">Mükemmel (98%)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Bekleyen Siparişler</p>
                <p className="text-xs text-gray-500">{stats.pendingOrders} sipariş</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
