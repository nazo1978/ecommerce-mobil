import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Gavel, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Users,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminAuctionsPage() {
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
  const auctions = [
    {
      id: '1',
      title: 'Nadir Kitap Koleksiyonu',
      description: 'Osmanlı dönemi nadir kitap koleksiyonu',
      startingPrice: 5000,
      currentBid: 7250,
      bidCount: 15,
      status: 'active',
      startDate: '2024-01-15T10:00:00Z',
      endDate: '2024-01-25T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      category: 'Kitap & Hobi'
    },
    {
      id: '2',
      title: 'Antika Osmanlı Halısı',
      description: '19. yüzyıl Osmanlı halısı, el dokuması',
      startingPrice: 15000,
      currentBid: 18750,
      bidCount: 8,
      status: 'active',
      startDate: '2024-01-10T14:00:00Z',
      endDate: '2024-01-20T20:00:00Z',
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500',
      category: 'Antika'
    },
    {
      id: '3',
      title: 'Vintage Rolex Submariner',
      description: '1970 model Rolex Submariner, orijinal kutu ve belgeli',
      startingPrice: 25000,
      currentBid: 32500,
      bidCount: 12,
      status: 'active',
      startDate: '2024-01-12T09:00:00Z',
      endDate: '2024-01-22T21:00:00Z',
      image: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=500',
      category: 'Saat & Aksesuar'
    },
    {
      id: '4',
      title: 'Klasik Araba - 1967 Mustang',
      description: '1967 Ford Mustang Fastback, restore edilmiş',
      startingPrice: 150000,
      currentBid: 185000,
      bidCount: 6,
      status: 'ended',
      startDate: '2024-01-01T12:00:00Z',
      endDate: '2024-01-15T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
      category: 'Otomotiv'
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

  const activeAuctions = auctions.filter(a => a.status === 'active').length
  const endedAuctions = auctions.filter(a => a.status === 'ended').length
  const totalBids = auctions.reduce((sum, a) => sum + a.bidCount, 0)
  const totalValue = auctions.reduce((sum, a) => sum + a.currentBid, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Açık Artırma Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Müzayedeleri görüntüle, düzenle ve yönet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Raporlar
          </Button>
          <Link href="/admin/auctions/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Müzayede Ekle
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
                <p className="text-sm text-gray-600">Aktif Müzayede</p>
                <p className="text-2xl font-bold">{activeAuctions}</p>
              </div>
              <Gavel className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sona Eren</p>
                <p className="text-2xl font-bold">{endedAuctions}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Teklif</p>
                <p className="text-2xl font-bold">{totalBids}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Değer</p>
                <p className="text-2xl font-bold">₺{totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Müzayede Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Müzayedeler</CardTitle>
          <CardDescription>
            Tüm müzayedelerin listesi ve yönetim seçenekleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {auction.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Kategori: {auction.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      Başlangıç: ₺{auction.startingPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      Teklif: {auction.bidCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₺{auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getTimeRemaining(auction.endDate)}
                    </p>
                    {getStatusBadge(auction.status, auction.endDate)}
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
