import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/product-card';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  price: 99.99,
  comparePrice: 149.99,
  images: ['/test-image.jpg'],
  rating: 4.5,
  reviewCount: 10,
  stock: 5,
  vendor: {
    id: 'vendor1',
    name: 'Test Vendor',
    storeSlug: 'test-vendor',
  },
  isNew: true,
  isFeatured: false,
  discount: 33,
};

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('₺99,99')).toBeInTheDocument();
    expect(screen.getByText('₺149,99')).toBeInTheDocument();
  });

  it('should show new badge when product is new', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Yeni')).toBeInTheDocument();
  });

  it('should show discount badge when product has discount', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('%33 İndirim')).toBeInTheDocument();
  });

  it('should show stock warning when stock is low', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Son 5 adet!')).toBeInTheDocument();
  });

  it('should show out of stock when stock is zero', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Tükendi')).toBeInTheDocument();
    expect(screen.getByText('Stokta Yok')).toBeInTheDocument();
  });

  it('should call onAddToCart when add to cart button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    const addToCartButton = screen.getByText('Sepete Ekle');
    fireEvent.click(addToCartButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });

  it('should call onToggleWishlist when wishlist button is clicked', () => {
    const mockToggleWishlist = jest.fn();
    render(<ProductCard product={mockProduct} onToggleWishlist={mockToggleWishlist} />);

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    expect(mockToggleWishlist).toHaveBeenCalledWith('1');
  });

  it('should show filled heart when product is in wishlist', () => {
    render(<ProductCard product={mockProduct} isInWishlist={true} />);

    const heartIcon = screen.getByRole('button', { name: /remove from wishlist/i }).querySelector('svg');
    expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500');
  });

  it('should not show vendor when showVendor is false', () => {
    render(<ProductCard product={mockProduct} showVendor={false} />);
    
    expect(screen.queryByText('Test Vendor')).not.toBeInTheDocument();
  });

  it('should render rating stars correctly', () => {
    const { container } = render(<ProductCard product={mockProduct} />);

    const stars = container.querySelectorAll('.lucide-star');
    const filledStars = Array.from(stars).filter(star =>
      star.classList.contains('fill-yellow-400')
    );

    expect(filledStars).toHaveLength(4); // 4.5 rating = 4 filled stars
  });

  it('should disable add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    const addToCartButton = screen.getByText('Stokta Yok');
    expect(addToCartButton).toBeDisabled();
  });
});
