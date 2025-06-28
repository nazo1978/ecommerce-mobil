import { IService, IRepository } from '../core/interfaces';

/**
 * Base service class implementing common CRUD operations
 * @template T - The entity type
 */
export abstract class BaseService<T> implements IService<T> {
  constructor(protected repository: IRepository<T>) {}

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async getAll(filters?: Record<string, any>): Promise<T[]> {
    return this.repository.findAll(filters);
  }

  async create(data: Partial<T>): Promise<T> {
    // Validate data before creation
    await this.validateCreate(data);
    
    // Apply business rules
    const processedData = await this.beforeCreate(data);
    
    // Create entity
    const entity = await this.repository.create(processedData);
    
    // Post-creation hooks
    await this.afterCreate(entity);
    
    return entity;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    // Check if entity exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    // Validate update data
    await this.validateUpdate(id, data);
    
    // Apply business rules
    const processedData = await this.beforeUpdate(id, data, existing);
    
    // Update entity
    const entity = await this.repository.update(id, processedData);
    
    // Post-update hooks
    await this.afterUpdate(entity, existing);
    
    return entity;
  }

  async delete(id: string): Promise<void> {
    // Check if entity exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    // Validate deletion
    await this.validateDelete(id, existing);
    
    // Pre-deletion hooks
    await this.beforeDelete(id, existing);
    
    // Delete entity
    await this.repository.delete(id);
    
    // Post-deletion hooks
    await this.afterDelete(id, existing);
  }

  // Hook methods to be overridden by subclasses
  protected async validateCreate(data: Partial<T>): Promise<void> {
    // Override in subclasses for custom validation
  }

  protected async validateUpdate(id: string, data: Partial<T>): Promise<void> {
    // Override in subclasses for custom validation
  }

  protected async validateDelete(id: string, entity: T): Promise<void> {
    // Override in subclasses for custom validation
  }

  protected async beforeCreate(data: Partial<T>): Promise<Partial<T>> {
    // Override in subclasses for pre-creation processing
    return data;
  }

  protected async beforeUpdate(id: string, data: Partial<T>, existing: T): Promise<Partial<T>> {
    // Override in subclasses for pre-update processing
    return data;
  }

  protected async beforeDelete(id: string, entity: T): Promise<void> {
    // Override in subclasses for pre-deletion processing
  }

  protected async afterCreate(entity: T): Promise<void> {
    // Override in subclasses for post-creation processing
  }

  protected async afterUpdate(entity: T, previous: T): Promise<void> {
    // Override in subclasses for post-update processing
  }

  protected async afterDelete(id: string, entity: T): Promise<void> {
    // Override in subclasses for post-deletion processing
  }
}
