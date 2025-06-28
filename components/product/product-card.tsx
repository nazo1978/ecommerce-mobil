'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice, truncate } from '@/lib/utils';

interface ProductCardProps {
  product: {
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
  };
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showVendor?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  showVendor = true,
  size = 'md',
}: ProductCardProps) {
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : product.discount;

  const isOutOfStock = product.stock === 0;

  const cardSizes = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };

  const imageSizes = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${cardSizes[size]}`}>
      {/* Product Image */}
      <div className={`relative ${imageSizes[size]} overflow-hidden bg-muted`}>
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="success" className="text-xs">
              Yeni
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="warning" className="text-xs">
              Öne Çıkan
            </Badge>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              %{discountPercentage} İndirim
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs">
              Tükendi
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={() => onToggleWishlist?.(product.id)}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
          
          <Link href={`/products/${product.slug}`}>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Vendor */}
        {showVendor && (
          <Link 
            href={`/stores/${product.vendor.storeSlug}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {product.vendor.name}
          </Link>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm mt-1 hover:text-primary transition-colors line-clamp-2">
            {truncate(product.name, size === 'sm' ? 40 : 60)}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && product.reviewCount && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-600 mt-1">
            Son {product.stock} adet!
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product.id)}
          disabled={isOutOfStock}
          variant={isOutOfStock ? 'secondary' : 'default'}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
        </Button>
      </CardFooter>
    </Card>
  );
}
