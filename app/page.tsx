import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@clerk/nextjs/server'
import { Star, TrendingUp, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import { ProductRepository } from '@/backend/repositories/product.repository'
import { AuctionRepository } from '@/backend/repositories/auction.repository'
import { CategoryRepository } from '@/backend/repositories/category.repository'

export default async function HomePage() {
  const { userId } = auth()

  // Initialize repositories
  const productRepository = new ProductRepository()
  const auctionRepository = new AuctionRepository()
  const categoryRepository = new CategoryRepository()

  // Fetch real data from Sanity
  const featuredProducts = await productRepository.findFeatured()
  const activeAuctions = await auctionRepository.findActive()
  const categories = await categoryRepository.findAll()

  // Fallback to mock data if no real data available
  const mockProducts = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Apple iPhone 15 Pro Max 256GB Doğal Titanyum',
      price: 65999,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
      isFeatured: true,
      rating: 4.8,
      reviewCount: 156
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Samsung Galaxy S24 Ultra 512GB Titanyum Gri',
      price: 58999,
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
      isFeatured: true,
      rating: 4.7,
      reviewCount: 89
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD',
      price: 45999,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
      isFeatured: true,
      rating: 4.9,
      reviewCount: 234
    }
  ]

  const mockAuctions = [
    {
      id: '1',
      title: 'Vintage Rolex Submariner',
      images: ['https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=500'],
      currentBid: 32500,
      bidCount: 12
    },
    {
      id: '2',
      title: 'Antika Osmanlı Halısı',
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500'],
      currentBid: 18750,
      bidCount: 8
    }
  ]

  const mockCategories = [
    { id: '1', name: 'Elektronik', icon: '📱', productCount: 25 },
    { id: '2', name: 'Moda & Giyim', icon: '👕', productCount: 40 },
    { id: '3', name: 'Ev & Yaşam', icon: '🏠', productCount: 30 },
    { id: '4', name: 'Spor & Outdoor', icon: '⚽', productCount: 20 },
    { id: '5', name: 'Kitap & Hobi', icon: '📚', productCount: 15 },
    { id: '6', name: 'Otomotiv', icon: '🚗', productCount: 18 }
  ]

  // Use real data if available, fallback to mock data
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : mockProducts
  const displayAuctions = activeAuctions.length > 0 ? activeAuctions : mockAuctions
  const displayCategories = categories.length > 0 ? categories : mockCategories

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            E-Commerce Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern e-ticaret platformu - Ürün satışı, müzayedeler ve daha fazlası
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link href="/products">
                Ürünleri Görüntüle
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/auctions">
                Müzayedeleri Görüntüle
              </Link>
            </Button>

            {userId ? (
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="secondary" size="lg">
                <Link href="/sign-in">
                  Giriş Yap
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
            <Button asChild variant="outline">
              <Link href="/products">Tümünü Gör</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Resim Yok</span>
                      </div>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-2 left-2">Öne Çıkan</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="mb-3 line-clamp-2">
                    {product.description}
                  </CardDescription>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/products/${product.slug}`}>Detayları Gör</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Active Auctions */}
      {activeAuctions.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-white/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Aktif Müzayedeler</h2>
            <Button asChild variant="outline">
              <Link href="/auctions">Tümünü Gör</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayAuctions.map((auction) => (
              <Card key={auction.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    {auction.images && auction.images.length > 0 ? (
                      <Image
                        src={auction.images[0]}
                        alt={auction.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Resim Yok</span>
                      </div>
                    )}
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Canlı
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{auction.title}</CardTitle>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mevcut Teklif:</span>
                      <span className="font-semibold">₺{auction.currentBid.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Teklif Sayısı:</span>
                      <span className="font-semibold">{auction.bidCount}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/auctions/${auction.id}`}>Teklif Ver</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {displayCategories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kategoriler</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayCategories.slice(0, 12).map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="h-12 w-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">{category.icon || '📦'}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {category.productCount || 0} ürün
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">100+</h3>
            <p className="text-gray-600">Öne Çıkan Ürün</p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">25+</h3>
            <p className="text-gray-600">Aktif Müzayede</p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">50+</h3>
            <p className="text-gray-600">Kategori</p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">4.8+</h3>
            <p className="text-gray-600">Müşteri Memnuniyeti</p>
          </div>
        </div>
      </section>
    </div>
  )
}
