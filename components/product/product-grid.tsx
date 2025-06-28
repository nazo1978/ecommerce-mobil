'use client';

import { ProductCard } from './product-card';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  stock: number;
  vendor: {
    id: string;
    name: string;
    storeSlug: string;
  };
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistItems?: string[];
  showVendor?: boolean;
  columns?: 2 | 3 | 4 | 5;
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistItems = [],
  showVendor = true,
  columns = 4,
  loading = false,
  emptyMessage = 'Ürün bulunamadı.',
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-muted rounded h-4 w-3/4"></div>
              <div className="bg-muted rounded h-4 w-1/2"></div>
              <div className="bg-muted rounded h-6 w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          {emptyMessage}
        </div>
        <p className="text-sm text-muted-foreground">
          Farklı filtreler deneyebilir veya kategorilere göz atabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={wishlistItems.includes(product.id)}
          showVendor={showVendor}
        />
      ))}
    </div>
  );
}
