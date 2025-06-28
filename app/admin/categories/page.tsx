import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  Hash
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminCategoriesPage() {
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
  const categories = [
    {
      id: '1',
      name: 'Elektronik',
      description: 'Telefon, bilgisayar, tablet ve elektronik cihazlar',
      slug: 'elektronik',
      icon: '📱',
      productCount: 25,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '1a', name: 'Telefon & Tablet', productCount: 15 },
        { id: '1b', name: 'Bilgisayar & Laptop', productCount: 8 },
        { id: '1c', name: 'Ses & Görüntü', productCount: 2 }
      ]
    },
    {
      id: '2',
      name: 'Ev & Yaşam',
      description: 'Ev dekorasyonu, mobilya ve yaşam ürünleri',
      slug: 'ev-yasam',
      icon: '🏠',
      productCount: 30,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '2a', name: 'Mobilya', productCount: 18 },
        { id: '2b', name: 'Dekorasyon', productCount: 8 },
        { id: '2c', name: 'Mutfak', productCount: 4 }
      ]
    },
    {
      id: '3',
      name: 'Moda & Giyim',
      description: 'Kadın, erkek ve çocuk giyim ürünleri',
      slug: 'moda-giyim',
      icon: '👕',
      productCount: 40,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '3a', name: 'Kadın Giyim', productCount: 20 },
        { id: '3b', name: 'Erkek Giyim', productCount: 15 },
        { id: '3c', name: 'Çocuk Giyim', productCount: 5 }
      ]
    },
    {
      id: '4',
      name: 'Spor & Outdoor',
      description: 'Spor malzemeleri ve outdoor ürünleri',
      slug: 'spor-outdoor',
      icon: '⚽',
      productCount: 20,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '4a', name: 'Fitness', productCount: 12 },
        { id: '4b', name: 'Outdoor', productCount: 8 }
      ]
    },
    {
      id: '5',
      name: 'Otomotiv',
      description: 'Araç, yedek parça ve otomotiv ürünleri',
      slug: 'otomotiv',
      icon: '🚗',
      productCount: 18,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '5a', name: 'Yedek Parça', productCount: 10 },
        { id: '5b', name: 'Aksesuar', productCount: 8 }
      ]
    },
    {
      id: '6',
      name: 'Kitap & Hobi',
      description: 'Kitap, dergi ve hobi ürünleri',
      slug: 'kitap-hobi',
      icon: '📚',
      productCount: 15,
      status: 'active',
      parentId: null,
      createdAt: '2024-01-01',
      subcategories: [
        { id: '6a', name: 'Kitap', productCount: 10 },
        { id: '6b', name: 'Hobi', productCount: 5 }
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktif</Badge>
      case 'inactive':
        return <Badge variant="secondary">Pasif</Badge>
      case 'draft':
        return <Badge variant="outline">Taslak</Badge>
      default:
        return <Badge variant="destructive">Bilinmiyor</Badge>
    }
  }

  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)
  const activeCategories = categories.filter(cat => cat.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Kategorileri görüntüle, düzenle ve yönet
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analitik
          </Button>
          <Link href="/admin/categories/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Kategori Ekle
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
                <p className="text-sm text-gray-600">Ana Kategori</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
              <FolderTree className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alt Kategori</p>
                <p className="text-2xl font-bold">{totalSubcategories}</p>
              </div>
              <Hash className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Kategori</p>
                <p className="text-2xl font-bold">{activeCategories}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kategori Listesi */}
      <Card>
        <CardHeader>
          <CardTitle>Kategoriler</CardTitle>
          <CardDescription>
            Tüm kategorilerin listesi ve yönetim seçenekleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50">
                {/* Ana Kategori */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Slug: {category.slug}
                        </span>
                        <span className="text-sm text-gray-600">
                          Ürün: {category.productCount}
                        </span>
                        <span className="text-sm text-gray-600">
                          Alt Kategori: {category.subcategories.length}
                        </span>
                        <span className="text-sm text-gray-600">
                          Tarih: {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {getStatusBadge(category.status)}
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

                {/* Alt Kategoriler */}
                {category.subcategories.length > 0 && (
                  <div className="ml-8 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Alt Kategoriler:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <span className="text-sm text-gray-700">
                            {subcategory.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {subcategory.productCount} ürün
                            </Badge>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
