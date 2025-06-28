import { BaseRepository } from './base.repository';
import { Product } from '../entities/product.entity';
import { GROQ_QUERIES } from '../../lib/sanity/client';

export class ProductRepository extends BaseRepository<Product> {
  protected documentType = 'product';

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      const result = await this.executeQuery(GROQ_QUERIES.GET_PRODUCT_BY_SLUG, { slug });
      return result ? this.mapSanityDoc(result) : null;
    } catch (error) {
      console.error('Error finding product by slug:', error);
      return null;
    }
  }

  async findBySku(sku: string): Promise<Product | null> {
    try {
      const query = `*[_type == "product" && sku == $sku][0]`;
      const result = await this.executeQuery(query, { sku });
      return result ? this.mapSanityDoc(result) : null;
    } catch (error) {
      console.error('Error finding product by SKU:', error);
      return null;
    }
  }

  async findByCategory(categoryId: string, limit: number = 20): Promise<Product[]> {
    try {
      const query = `${GROQ_QUERIES.GET_PRODUCTS_BY_CATEGORY}[0...${limit}]`;
      const results = await this.executeQuery(query, { categoryId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding products by category:', error);
      return [];
    }
  }

  async findByVendor(vendorId: string, limit: number = 20): Promise<Product[]> {
    try {
      const query = `${GROQ_QUERIES.GET_PRODUCTS_BY_VENDOR}[0...${limit}]`;
      const results = await this.executeQuery(query, { vendorId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding products by vendor:', error);
      return [];
    }
  }

  async findPublished(limit: number = 20, offset: number = 0): Promise<Product[]> {
    try {
      const query = `${GROQ_QUERIES.GET_PRODUCTS}[${offset}...${offset + limit}]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding published products:', error);
      return [];
    }
  }

  async findFeatured(limit: number = 10): Promise<Product[]> {
    try {
      const query = `*[_type == "product" && isActive == true && isPublished == true && isFeatured == true] | order(_createdAt desc)[0...${limit}]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding featured products:', error);
      return [];
    }
  }

  async findLowStock(threshold: number = 10): Promise<Product[]> {
    try {
      const query = `*[_type == "product" && isActive == true && stock <= $threshold] | order(stock asc)`;
      const results = await this.executeQuery(query, { threshold });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding low stock products:', error);
      return [];
    }
  }

  async searchProducts(searchTerm: string, filters?: any, limit: number = 20): Promise<Product[]> {
    try {
      let query = `*[_type == "product" && isActive == true && isPublished == true && (
        name match $searchTerm ||
        description match $searchTerm ||
        shortDescription match $searchTerm ||
        $searchTerm in tags
      )]`;

      // Add filters
      if (filters?.categoryId) {
        query += ` && category._ref == "${filters.categoryId}"`;
      }
      if (filters?.vendorId) {
        query += ` && vendor._ref == "${filters.vendorId}"`;
      }
      if (filters?.minPrice) {
        query += ` && price >= ${filters.minPrice}`;
      }
      if (filters?.maxPrice) {
        query += ` && price <= ${filters.maxPrice}`;
      }
      if (filters?.inStock) {
        query += ` && stock > 0`;
      }

      // Add sorting
      if (filters?.sortBy) {
        const direction = filters.sortDirection || 'desc';
        query += ` | order(${filters.sortBy} ${direction})`;
      } else {
        query += ` | order(_score desc, _createdAt desc)`;
      }

      query += `[0...${limit}]`;

      const results = await this.executeQuery(query, { 
        searchTerm: `*${searchTerm}*` 
      });
      
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async updateStock(productId: string, quantity: number): Promise<Product> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const newStock = Math.max(0, product.stock + quantity);
      
      return await this.update(productId, {
        stock: newStock,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  async incrementViewCount(productId: string): Promise<void> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        return;
      }

      await this.update(productId, {
        viewCount: (product.viewCount || 0) + 1,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error for view count updates
    }
  }

  async incrementSalesCount(productId: string): Promise<void> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        return;
      }

      await this.update(productId, {
        salesCount: (product.salesCount || 0) + 1,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error incrementing sales count:', error);
      throw error;
    }
  }

  async updateRating(productId: string, rating: number, reviewCount: number): Promise<Product> {
    try {
      return await this.update(productId, {
        rating,
        reviewCount,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  }

  async publish(productId: string): Promise<Product> {
    try {
      return await this.update(productId, {
        isPublished: true,
        publishedAt: new Date(),
      } as Partial<Product>);
    } catch (error) {
      console.error('Error publishing product:', error);
      throw error;
    }
  }

  async unpublish(productId: string): Promise<Product> {
    try {
      return await this.update(productId, {
        isPublished: false,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error unpublishing product:', error);
      throw error;
    }
  }

  async setFeatured(productId: string, featured: boolean): Promise<Product> {
    try {
      return await this.update(productId, {
        isFeatured: featured,
      } as Partial<Product>);
    } catch (error) {
      console.error('Error setting featured status:', error);
      throw error;
    }
  }

  async getProductStats(productId: string): Promise<any> {
    try {
      const query = `{
        "product": *[_type == "product" && _id == $productId][0],
        "orderCount": count(*[_type == "orderItem" && product._ref == $productId]),
        "totalSold": sum(*[_type == "orderItem" && product._ref == $productId].quantity),
        "revenue": sum(*[_type == "orderItem" && product._ref == $productId].total),
        "averageRating": avg(*[_type == "review" && product._ref == $productId].rating)
      }`;
      
      return await this.executeQuery(query, { productId });
    } catch (error) {
      console.error('Error getting product stats:', error);
      return null;
    }
  }

  async getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
    try {
      const product = await this.findById(productId);
      if (!product) {
        return [];
      }

      const query = `*[_type == "product" && 
        _id != $productId && 
        isActive == true && 
        isPublished == true && 
        (category._ref == $categoryId || $vendorId in tags)
      ] | order(_createdAt desc)[0...${limit}]`;
      
      const results = await this.executeQuery(query, { 
        productId,
        categoryId: product.categoryId,
        vendorId: product.vendorId,
      });
      
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error getting related products:', error);
      return [];
    }
  }
}
