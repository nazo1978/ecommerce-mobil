/**
 * Generic repository interface for data access operations
 * @template T - The entity type
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  findBy(criteria: Record<string, any>): Promise<T[]>;
  findOne(criteria: Record<string, any>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(filters?: Record<string, any>): Promise<number>;
  exists(id: string): Promise<boolean>;
}

/**
 * Extended repository interface with bulk operations
 * @template T - The entity type
 */
export interface IExtendedRepository<T> extends IRepository<T> {
  bulkCreate(data: Partial<T>[]): Promise<T[]>;
  bulkUpdate(updates: { id: string; data: Partial<T> }[]): Promise<T[]>;
  bulkDelete(ids: string[]): Promise<void>;
  transaction<R>(callback: (repo: IRepository<T>) => Promise<R>): Promise<R>;
}
