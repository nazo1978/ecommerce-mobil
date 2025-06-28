/**
 * Generic service interface for CRUD operations
 * @template T - The entity type
 */
export interface IService<T> {
  getById(id: string): Promise<T | null>;
  getAll(filters?: Record<string, any>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Extended service interface with additional query capabilities
 * @template T - The entity type
 */
export interface IExtendedService<T> extends IService<T> {
  findBy(criteria: Record<string, any>): Promise<T[]>;
  count(filters?: Record<string, any>): Promise<number>;
  exists(id: string): Promise<boolean>;
  bulkCreate(data: Partial<T>[]): Promise<T[]>;
  bulkUpdate(updates: { id: string; data: Partial<T> }[]): Promise<T[]>;
  bulkDelete(ids: string[]): Promise<void>;
}
