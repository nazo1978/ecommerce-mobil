import { BaseRepository } from './base.repository';
import { Category } from '../entities/category.entity';

export class CategoryRepository extends BaseRepository<Category> {
  protected documentType = 'category';

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const query = `*[_type == "category" && slug == $slug][0]`;
      const result = await this.executeQuery(query, { slug });
      return result ? this.mapSanityDoc(result) : null;
    } catch (error) {
      console.error('Error finding category by slug:', error);
      return null;
    }
  }

  async findActive(limit: number = 50): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true] | order(name asc)[0...${limit}]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding active categories:', error);
      return [];
    }
  }

  async findParentCategories(): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true && !defined(parentId)] | order(name asc)`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding parent categories:', error);
      return [];
    }
  }

  async findSubCategories(parentId: string): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true && parentId == $parentId] | order(name asc)`;
      const results = await this.executeQuery(query, { parentId });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding subcategories:', error);
      return [];
    }
  }

  async findWithProductCount(): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true] {
        ...,
        "productCount": count(*[_type == "product" && categoryId == ^._id && isActive == true])
      } | order(name asc)`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding categories with product count:', error);
      return [];
    }
  }

  async findPopular(limit: number = 10): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true] {
        ...,
        "productCount": count(*[_type == "product" && categoryId == ^._id && isActive == true])
      } | order(productCount desc)[0...${limit}]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding popular categories:', error);
      return [];
    }
  }

  async findFeatured(limit: number = 6): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true && isFeatured == true] | order(name asc)[0...${limit}]`;
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error finding featured categories:', error);
      return [];
    }
  }

  async updateProductCount(categoryId: string): Promise<void> {
    try {
      const query = `count(*[_type == "product" && categoryId == $categoryId && isActive == true])`;
      const productCount = await this.executeQuery(query, { categoryId });
      
      await this.update(categoryId, {
        productCount: productCount || 0,
      } as Partial<Category>);
    } catch (error) {
      console.error('Error updating product count:', error);
      // Don't throw error for count updates
    }
  }

  async searchByName(searchTerm: string, limit: number = 20): Promise<Category[]> {
    try {
      const query = `*[_type == "category" && isActive == true && name match $searchTerm] | order(name asc)[0...${limit}]`;
      const results = await this.executeQuery(query, { searchTerm: `*${searchTerm}*` });
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error searching categories by name:', error);
      return [];
    }
  }

  async getCategoryHierarchy(categoryId: string): Promise<Category[]> {
    try {
      const category = await this.findById(categoryId);
      if (!category) {
        return [];
      }

      const hierarchy: Category[] = [category];
      
      // Get parent categories recursively
      let currentCategory = category;
      while (currentCategory.parentId) {
        const parent = await this.findById(currentCategory.parentId);
        if (parent) {
          hierarchy.unshift(parent);
          currentCategory = parent;
        } else {
          break;
        }
      }

      return hierarchy;
    } catch (error) {
      console.error('Error getting category hierarchy:', error);
      return [];
    }
  }

  async getCategoryTree(): Promise<Category[]> {
    try {
      // Get all categories with their children
      const query = `*[_type == "category" && isActive == true && !defined(parentId)] {
        ...,
        "children": *[_type == "category" && isActive == true && parentId == ^._id] | order(name asc)
      } | order(name asc)`;
      
      const results = await this.executeQuery(query);
      return results.map((doc: any) => this.mapSanityDoc(doc));
    } catch (error) {
      console.error('Error getting category tree:', error);
      return [];
    }
  }
}
