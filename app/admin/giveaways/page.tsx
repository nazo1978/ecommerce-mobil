import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Users,
  Trophy
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminGiveawaysPage() {
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

  // Mock data - gerçek uygulamada Sanity'den gelecek
  const giveaways = [
    {
      id: '1',
      title: 'iPhone 15 Pro Çekilişi',
      description: 'Yeni yıl özel çekilişi - iPhone 15 Pro 256GB kazanma şansı',
      prize: 'iPhone 15 Pro 256GB',
      prizeValue: 65999,
      participants: 1250,
      maxParticipants: 2000,
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      requirements: ['Üye olma', 'E-posta doğrulama', 'Sosyal medya takibi']
    },
    {
      id: '2',
      title: 'MacBook Air M3 Çekilişi',
      description: 'Öğrenciler için özel çekiliş kampanyası',
      prize: 'MacBook Air M3 13"',
      prizeValue: 45999,
      participants: 890,
      maxParticipants: 1500,
      status: 'active',
      startDate: '2024-01-10T00:00:00Z',
      endDate: '2024-02-10T23:59:59Z',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      requirements: ['Öğrenci belgesi', 'Üye olma', 'Referans getirme']
    },
    {
      id: '3',
      title: 'Gaming Setup Çekilişi',
      description: 'Oyuncular için komple gaming setup çekilişi',
      prize: 'Gaming PC + Monitör + Klavye/Mouse',
      prizeValue: 35000,
      participants: 2100,
      maxParticipants: 3000,
      status: 'active',
      startDate: '2024-01-05T00:00:00Z',
      endDate: '2024-01-25T23:59:59Z',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
      requirements: ['Üye olma', 'Discord katılımı', 'Twitch takibi']
    },
    {
      id: '4',
      title: 'Yılbaşı Hediye Çekilişi',
      description: 'Yılbaşı özel hediye paketi çekilişi',
      prize: 'Hediye Paketi (₺5000 değerinde)',
      prizeValue: 5000,
      participants: 3500,
      maxParticipants: 3500,
      status: 'ended',
      startDate: '2023-12-01T00:00:00Z',
      endDate: '2023-12-31T23:59:59Z',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500',
      requirements: ['Üye olma', 'Alışveriş yapma'],
      winner: 'Ahmet Yılmaz'
    }
  ]

  const getStatusBadge = (status: string, endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    
    if (status === 'ended' || end < now) {
      return <Badge variant="secondary">Sona Erdi</Badge>
    }
    if (status === 'active') {
      return <Badge variant="default">Aktif</Badge>
    }
    if (status === 'pending') {
      return <Badge variant="outline">Beklemede</Badge>
    }
    return <Badge variant="destructive">Bilinmiyor</Badge>
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Sona erdi'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} gün ${hours} saat`
    return `${hours} saat`
  }

  const getParticipationRate = (participants: number, maxParticipants: number) => {
    return Math.round((participants / maxParticipants) * 100)
  }

  const activeGiveaways = giveaways.filter(g => g.status === 'active').length
  const endedGiveaways = giveaways.filter(g => g.status === 'ended').length
  const totalParticipants = giveaways.reduce((sum, g) => sum + g.participants, 0)
  const totalPrizeValue = giveaways.reduce((sum, g) => sum + g.prizeValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Çekiliş Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Çekilişleri görüntüle, düzenle ve yönet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Trophy className="h-4 w-4 mr-2" />
            Kazananlar
          </Button>
          <Link href="/admin/giveaways/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Çekiliş Ekle
            </Button>
          </Link>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Çekiliş</p>
                <p className="text-2xl font-bold">{activeGiveaways}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sona Eren</p>
                <p className="text-2xl font-bold">{endedGiveaways}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Katılımcı</p>
                <p className="text-2xl font-bold">{totalParticipants.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Hediye Değeri</p>
                <p className="text-2xl font-bold">₺{totalPrizeValue.toLocaleString()}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Çekiliş Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Çekilişler</CardTitle>
          <CardDescription>
            Tüm çekilişlerin listesi ve yönetim seçenekleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {giveaways.map((giveaway) => (
              <div key={giveaway.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={giveaway.image}
                  alt={giveaway.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {giveaway.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {giveaway.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Hediye: {giveaway.prize}
                    </span>
                    <span className="text-sm text-gray-600">
                      Değer: ₺{giveaway.prizeValue.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Katılım: {getParticipationRate(giveaway.participants, giveaway.maxParticipants)}%
                    </span>
                  </div>
                  {giveaway.winner && (
                    <div className="mt-1">
                      <span className="text-sm text-green-600 font-medium">
                        Kazanan: {giveaway.winner}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {giveaway.participants.toLocaleString()} / {giveaway.maxParticipants.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getTimeRemaining(giveaway.endDate)}
                    </p>
                    {getStatusBadge(giveaway.status, giveaway.endDate)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
