/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  findOne(filterQuery?: any): { exec: () => T } {
    return { exec: (): T => this.entityStub };
  }

  find(filterQuery?: any): { exec: () => T[] } {
    return { exec: (): T[] => [this.entityStub] };
  }

  findById(id: string): this {
    return this;
  }

  populate(path: string, select?: string): this {
    return this;
  }

  findOneAndUpdate(filterQuery: any, update: any, options?: any): this {
    return this;
  }

  insertMany(entities: T[]): Promise<T[]> {
    return Promise.resolve(entities);
  }

  insertOne(entity: T): Promise<T> {
    return Promise.resolve(entity);
  }

  deleteMany(filterQuery: any): Promise<{ deletedCount: number }> {
    return Promise.resolve({ deletedCount: 1 });
  }

  select(projection: any): this {
    return this;
  }

  exec(): Promise<any> {
    if (Array.isArray(this.entityStub)) {
      return Promise.resolve([this.entityStub]);
    }
    return Promise.resolve(this.entityStub);
  }
}
