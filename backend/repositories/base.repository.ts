import { IRepository } from '../core/interfaces';
import { client, sanityHelpers } from '../../lib/sanity/client';
import { BaseEntity } from '../core/types/common';

export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected abstract documentType: string;

  async findById(id: string): Promise<T | null> {
    try {
      const query = `*[_type == $type && _id == $id][0]`;
      const result = await client.fetch(query, { type: this.documentType, id });
      return result || null;
    } catch (error) {
      console.error(`Error finding ${this.documentType} by id:`, error);
      return null;
    }
  }

  async findBy(filters: Record<string, any>): Promise<T[]> {
    try {
      const filterConditions = Object.entries(filters)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key} == "${value}"`;
          }
          return `${key} == ${value}`;
        })
        .join(' && ');

      const query = `*[_type == "${this.documentType}" && ${filterConditions}]`;
      return await client.fetch(query);
    } catch (error) {
      console.error(`Error finding ${this.documentType} by filters:`, error);
      return [];
    }
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): Promise<T[]> {
    try {
      let query = `*[_type == "${this.documentType}"]`;
      
      if (options?.orderBy) {
        const direction = options.orderDirection || 'asc';
        query += ` | order(${options.orderBy} ${direction})`;
      }
      
      if (options?.limit || options?.offset) {
        const offset = options.offset || 0;
        const limit = options.limit || 50;
        query += `[${offset}...${offset + limit}]`;
      }

      return await client.fetch(query);
    } catch (error) {
      console.error(`Error finding all ${this.documentType}:`, error);
      return [];
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const doc = {
        _type: this.documentType,
        ...data,
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
      };

      const result = await client.create(doc);
      return this.mapSanityDoc(result);
    } catch (error) {
      console.error(`Error creating ${this.documentType}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const updateData = {
        ...data,
        _updatedAt: new Date().toISOString(),
      };

      const result = await client.patch(id).set(updateData).commit();
      return this.mapSanityDoc(result);
    } catch (error) {
      console.error(`Error updating ${this.documentType}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await client.delete(id);
    } catch (error) {
      console.error(`Error deleting ${this.documentType}:`, error);
      throw error;
    }
  }

  async count(filters?: Record<string, any>): Promise<number> {
    try {
      let query = `count(*[_type == "${this.documentType}"])`;
      
      if (filters && Object.keys(filters).length > 0) {
        const filterConditions = Object.entries(filters)
          .map(([key, value]) => {
            if (typeof value === 'string') {
              return `${key} == "${value}"`;
            }
            return `${key} == ${value}`;
          })
          .join(' && ');
        
        query = `count(*[_type == "${this.documentType}" && ${filterConditions}])`;
      }

      return await client.fetch(query);
    } catch (error) {
      console.error(`Error counting ${this.documentType}:`, error);
      return 0;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const query = `defined(*[_type == $type && _id == $id][0])`;
      return await client.fetch(query, { type: this.documentType, id });
    } catch (error) {
      console.error(`Error checking existence of ${this.documentType}:`, error);
      return false;
    }
  }

  async bulkCreate(items: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    try {
      const docs = items.map(item => ({
        _type: this.documentType,
        ...item,
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
      }));

      const transaction = client.transaction();
      docs.forEach(doc => transaction.create(doc));
      
      const results = await transaction.commit();
      return results.map(result => this.mapSanityDoc(result));
    } catch (error) {
      console.error(`Error bulk creating ${this.documentType}:`, error);
      throw error;
    }
  }

  async bulkUpdate(updates: { id: string; data: Partial<T> }[]): Promise<T[]> {
    try {
      const transaction = client.transaction();
      
      updates.forEach(({ id, data }) => {
        const updateData = {
          ...data,
          _updatedAt: new Date().toISOString(),
        };
        transaction.patch(id, { set: updateData });
      });
      
      const results = await transaction.commit();
      return results.map(result => this.mapSanityDoc(result));
    } catch (error) {
      console.error(`Error bulk updating ${this.documentType}:`, error);
      throw error;
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      const transaction = client.transaction();
      ids.forEach(id => transaction.delete(id));
      await transaction.commit();
    } catch (error) {
      console.error(`Error bulk deleting ${this.documentType}:`, error);
      throw error;
    }
  }

  // Helper method to map Sanity document to our entity format
  protected mapSanityDoc(doc: any): T {
    return {
      ...doc,
      id: doc._id,
      createdAt: new Date(doc._createdAt),
      updatedAt: new Date(doc._updatedAt),
    } as T;
  }

  // Helper method for complex queries
  protected async executeQuery(query: string, params?: any): Promise<any> {
    try {
      return await client.fetch(query, params);
    } catch (error) {
      console.error(`Error executing query:`, error);
      throw error;
    }
  }

  // Helper method for paginated queries
  protected async executePaginatedQuery(
    baseQuery: string,
    params: any = {},
    page: number = 1,
    limit: number = 20
  ) {
    return await sanityHelpers.fetchPaginated(baseQuery, params, page, limit);
  }
}
