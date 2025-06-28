import { BaseService } from './base.service';
import { Product, Category, Vendor } from '../entities/product.entity';
import { IRepository } from '../core/interfaces';
import { CreateProductDTO, UpdateProductDTO, ProductFilterDTO } from '../validation/product.validation';
import { PaginatedResponse } from '../core/types/common';

export class ProductService extends BaseService<Product> {
  constructor(
    productRepository: IRepository<Product>,
    private categoryRepository: IRepository<Category>,
    private vendorRepository: IRepository<Vendor>
  ) {
    super(productRepository);
  }

  async createProduct(vendorId: string, data: CreateProductDTO): Promise<Product> {
    // Verify vendor exists and is active
    const vendor = await this.vendorRepository.findById(vendorId);
    if (!vendor || !vendor.isActive) {
      throw new Error('Vendor not found or inactive');
    }

    // Verify category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category || !category.isActive) {
      throw new Error('Category not found or inactive');
    }

    // Check SKU uniqueness
    await this.validateSKU(data.sku);

    // Generate slug from name
    const slug = await this.generateSlug(data.name);

    const productData = {
      ...data,
      vendorId,
      slug,
      isActive: true,
      isPublished: false,
      isFeatured: false,
      viewCount: 0,
      salesCount: 0,
      rating: 0,
      reviewCount: 0,
    };

    return this.create(productData);
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
    // If SKU is being updated, validate uniqueness
    if (data.sku) {
      await this.validateSKU(data.sku, id);
    }

    // If name is being updated, regenerate slug
    if (data.name) {
      data.slug = await this.generateSlug(data.name, id);
    }

    return this.update(id, data);
  }

  async getProductsByVendor(vendorId: string, filters?: ProductFilterDTO): Promise<PaginatedResponse<Product>> {
    const allFilters = { ...filters, vendorId };
    return this.getFilteredProducts(allFilters);
  }

  async getFilteredProducts(filters: ProductFilterDTO): Promise<PaginatedResponse<Product>> {
    // This would typically involve complex database queries
    // For now, returning a basic structure
    const products = await this.repository.findBy(filters);
    const total = await this.repository.count(filters);

    return {
      data: products,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
        hasNext: (filters.page || 1) * (filters.limit || 20) < total,
        hasPrev: (filters.page || 1) > 1,
      },
    };
  }

  async publishProduct(id: string): Promise<Product> {
    const product = await this.getById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Validate product is ready for publishing
    await this.validateForPublishing(product);

    return this.update(id, { 
      isPublished: true, 
      publishedAt: new Date() 
    });
  }

  async unpublishProduct(id: string): Promise<Product> {
    return this.update(id, { isPublished: false });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newStock = Math.max(0, product.stock + quantity);
    return this.update(id, { stock: newStock });
  }

  async incrementViewCount(id: string): Promise<void> {
    const product = await this.getById(id);
    if (product) {
      await this.update(id, { viewCount: product.viewCount + 1 });
    }
  }

  async incrementSalesCount(id: string, quantity: number = 1): Promise<void> {
    const product = await this.getById(id);
    if (product) {
      await this.update(id, { salesCount: product.salesCount + quantity });
    }
  }

  async updateRating(id: string, newRating: number, reviewCount: number): Promise<Product> {
    return this.update(id, { rating: newRating, reviewCount });
  }

  async getProductsByCategory(categoryId: string, filters?: ProductFilterDTO): Promise<Product[]> {
    const allFilters = { ...filters, categoryId, isPublished: true, isActive: true };
    return this.repository.findBy(allFilters);
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.repository.findBy({ 
      isFeatured: true, 
      isPublished: true, 
      isActive: true 
    });
  }

  async searchProducts(query: string, filters?: ProductFilterDTO): Promise<Product[]> {
    const searchFilters = { 
      ...filters, 
      search: query,
      isPublished: true, 
      isActive: true 
    };
    return this.repository.findBy(searchFilters);
  }

  async getRelatedProducts(productId: string, limit: number = 5): Promise<Product[]> {
    const product = await this.getById(productId);
    if (!product) {
      return [];
    }

    // Find products in the same category, excluding the current product
    return this.repository.findBy({
      categoryId: product.categoryId,
      isPublished: true,
      isActive: true,
      // Exclude current product (this would be handled in the repository)
    });
  }

  private async validateSKU(sku: string, excludeId?: string): Promise<void> {
    const existing = await this.repository.findBy({ sku });
    const conflict = existing.find(p => p.id !== excludeId);
    
    if (conflict) {
      throw new Error('SKU already exists');
    }
  }

  private async generateSlug(name: string, excludeId?: string): Promise<string> {
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await this.slugExists(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.repository.findBy({ slug });
    return existing.some(p => p.id !== excludeId);
  }

  private async validateForPublishing(product: Product): Promise<void> {
    if (!product.name || product.name.length < 3) {
      throw new Error('Product name must be at least 3 characters');
    }

    if (!product.description || product.description.length < 10) {
      throw new Error('Product description must be at least 10 characters');
    }

    if (product.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (!product.images || product.images.length === 0) {
      throw new Error('Product must have at least one image');
    }

    if (!product.categoryId) {
      throw new Error('Product must have a category');
    }
  }

  protected async afterCreate(product: Product): Promise<void> {
    console.log(`Product created: ${product.name} (${product.sku})`);
  }

  protected async afterUpdate(product: Product, previous: Product): Promise<void> {
    // Handle stock alerts, price change notifications, etc.
    if (product.stock !== previous.stock && product.stock <= product.minStock) {
      console.log(`Low stock alert for product: ${product.name}`);
    }
  }
}
