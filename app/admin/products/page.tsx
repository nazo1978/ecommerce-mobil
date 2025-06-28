import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminProductsPage() {
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
  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Apple iPhone 15 Pro Max 256GB Doğal Titanyum',
      price: 65999,
      category: 'Elektronik',
      stock: 15,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'MacBook Air M3',
      description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD',
      price: 45999,
      category: 'Elektronik',
      stock: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Nike Air Max 270',
      description: 'Nike Air Max 270 Erkek Spor Ayakkabı - Siyah/Beyaz',
      price: 3299,
      category: 'Spor',
      stock: 0,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      createdAt: '2024-01-08'
    },
    {
      id: '4',
      name: 'IKEA Hemnes Yatak Odası Takımı',
      description: 'IKEA Hemnes Yatak Odası Takımı - Beyaz Vernik',
      price: 12999,
      category: 'Ev & Yaşam',
      stock: 3,
      status: 'low_stock',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      createdAt: '2024-01-05'
    }
  ]

  const getStatusBadge = (status: string, stock: number) => {
    if (status === 'out_of_stock' || stock === 0) {
      return <Badge variant="destructive">Stokta Yok</Badge>
    }
    if (status === 'low_stock' || stock < 5) {
      return <Badge variant="secondary">Az Stok</Badge>
    }
    return <Badge variant="default">Aktif</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Ürünleri görüntüle, düzenle ve yönet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrele
          </Button>
          <Link href="/admin/products/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ürün Ekle
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
                <p className="text-sm text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Ürün</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stokta Yok</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Az Stok</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock > 0 && p.stock < 5).length}
                </p>
              </div>
              <Search className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ürün Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Ürünler</CardTitle>
          <CardDescription>
            Tüm ürünlerin listesi ve yönetim seçenekleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Kategori: {product.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stok: {product.stock}
                    </span>
                    <span className="text-sm text-gray-600">
                      Tarih: {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₺{product.price.toLocaleString()}
                    </p>
                    {getStatusBadge(product.status, product.stock)}
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
