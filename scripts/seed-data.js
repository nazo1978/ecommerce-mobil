require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const categories = [
  {
    _type: 'category',
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Telefon, bilgisayar, tablet ve elektronik ürünler',
    icon: '📱',
    isActive: true,
    isFeatured: true,
    productCount: 25
  },
  {
    _type: 'category',
    name: 'Moda & Giyim',
    slug: 'moda-giyim',
    description: 'Kadın, erkek ve çocuk giyim ürünleri',
    icon: '👕',
    isActive: true,
    isFeatured: true,
    productCount: 40
  },
  {
    _type: 'category',
    name: 'Ev & Yaşam',
    slug: 'ev-yasam',
    description: 'Ev dekorasyonu, mobilya ve yaşam ürünleri',
    icon: '🏠',
    isActive: true,
    isFeatured: true,
    productCount: 30
  },
  {
    _type: 'category',
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    description: 'Spor malzemeleri ve outdoor ürünler',
    icon: '⚽',
    isActive: true,
    isFeatured: true,
    productCount: 20
  },
  {
    _type: 'category',
    name: 'Kitap & Hobi',
    slug: 'kitap-hobi',
    description: 'Kitaplar, oyunlar ve hobi ürünleri',
    icon: '📚',
    isActive: true,
    isFeatured: false,
    productCount: 15
  },
  {
    _type: 'category',
    name: 'Otomotiv',
    slug: 'otomotiv',
    description: 'Araç aksesuarları ve otomotiv ürünleri',
    icon: '🚗',
    isActive: true,
    isFeatured: false,
    productCount: 18
  }
];

const products = [
  {
    _type: 'product',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Apple iPhone 15 Pro Max 256GB Doğal Titanyum',
    price: 65999,
    compareAtPrice: 69999,
    categoryId: 'elektronik',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 25,
    rating: 4.8,
    reviewCount: 156,
    tags: ['apple', 'iphone', 'smartphone', 'premium']
  },
  {
    _type: 'product',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Samsung Galaxy S24 Ultra 512GB Titanyum Gri',
    price: 58999,
    compareAtPrice: 62999,
    categoryId: 'elektronik',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 18,
    rating: 4.7,
    reviewCount: 89,
    tags: ['samsung', 'galaxy', 'android', 'premium']
  },
  {
    _type: 'product',
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    description: 'Apple MacBook Air 13" M3 Çip 8GB RAM 256GB SSD',
    price: 45999,
    compareAtPrice: 49999,
    categoryId: 'elektronik',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 12,
    rating: 4.9,
    reviewCount: 234,
    tags: ['apple', 'macbook', 'laptop', 'premium']
  },
  {
    _type: 'product',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Nike Air Max 270 Erkek Spor Ayakkabı - Siyah/Beyaz',
    price: 3299,
    compareAtPrice: 3799,
    categoryId: 'spor-outdoor',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 45,
    rating: 4.6,
    reviewCount: 78,
    tags: ['nike', 'ayakkabı', 'spor', 'erkek']
  },
  {
    _type: 'product',
    name: 'Zara Kadın Blazer',
    slug: 'zara-kadin-blazer',
    description: 'Zara Kadın Oversize Blazer Ceket - Lacivert',
    price: 899,
    compareAtPrice: 1299,
    categoryId: 'moda-giyim',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 32,
    rating: 4.4,
    reviewCount: 45,
    tags: ['zara', 'blazer', 'kadın', 'moda']
  },
  {
    _type: 'product',
    name: 'IKEA Hemnes Yatak Odası Takımı',
    slug: 'ikea-hemnes-yatak-odasi',
    description: 'IKEA Hemnes Yatak Odası Takımı - Beyaz Vernik',
    price: 12999,
    compareAtPrice: 15999,
    categoryId: 'ev-yasam',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'
    ],
    isActive: true,
    isPublished: true,
    isFeatured: true,
    stock: 8,
    rating: 4.5,
    reviewCount: 67,
    tags: ['ikea', 'mobilya', 'yatak odası', 'ev']
  }
];

const auctions = [
  {
    _type: 'auction',
    title: 'Vintage Rolex Submariner',
    description: 'Orijinal 1970 model Rolex Submariner, mükemmel durumda',
    startingBid: 25000,
    currentBid: 32500,
    bidCount: 12,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün sonra
    status: 'active',
    categoryId: 'moda-giyim',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=500',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=500'
    ],
    tags: ['rolex', 'vintage', 'saat', 'koleksiyon']
  },
  {
    _type: 'auction',
    title: 'Antika Osmanlı Halısı',
    description: '19. yüzyıl Osmanlı dönemi el dokuma halı',
    startingBid: 15000,
    currentBid: 18750,
    bidCount: 8,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün sonra
    status: 'active',
    categoryId: 'ev-yasam',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
    ],
    tags: ['antika', 'halı', 'osmanlı', 'koleksiyon']
  },
  {
    _type: 'auction',
    title: 'Nadir Kitap Koleksiyonu',
    description: 'İlk baskı klasik edebiyat eserleri koleksiyonu',
    startingBid: 5000,
    currentBid: 7250,
    bidCount: 15,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 gün sonra
    status: 'active',
    categoryId: 'kitap-hobi',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
    ],
    tags: ['kitap', 'koleksiyon', 'nadir', 'edebiyat']
  },
  {
    _type: 'auction',
    title: 'Klasik Araba - 1967 Mustang',
    description: '1967 Ford Mustang Fastback, restore edilmiş',
    startingBid: 150000,
    currentBid: 185000,
    bidCount: 6,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 gün sonra
    status: 'active',
    categoryId: 'otomotiv',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'
    ],
    tags: ['klasik araba', 'mustang', 'ford', 'koleksiyon']
  }
];

async function seedData() {
  try {
    console.log('🌱 Seed verileri ekleniyor...');

    // Kategorileri ekle
    console.log('📂 Kategoriler ekleniyor...');
    for (const category of categories) {
      const result = await client.create(category);
      console.log(`✅ Kategori eklendi: ${category.name} (${result._id})`);
    }

    // Ürünleri ekle
    console.log('📦 Ürünler ekleniyor...');
    for (const product of products) {
      const result = await client.create(product);
      console.log(`✅ Ürün eklendi: ${product.name} (${result._id})`);
    }

    // Müzayedeleri ekle
    console.log('🔨 Müzayedeler ekleniyor...');
    for (const auction of auctions) {
      const result = await client.create(auction);
      console.log(`✅ Müzayede eklendi: ${auction.title} (${result._id})`);
    }

    console.log('🎉 Tüm seed verileri başarıyla eklendi!');
    console.log(`📊 Toplam: ${categories.length} kategori, ${products.length} ürün, ${auctions.length} müzayede`);

  } catch (error) {
    console.error('❌ Seed verisi eklenirken hata:', error);
  }
}

seedData();
