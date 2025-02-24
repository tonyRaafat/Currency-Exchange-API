import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findById(
    id: any,
    projection?: Record<string, unknown>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findById(id, projection, options).exec();
  }

  findOne(filterQuery: FilterQuery<T>, projection?: Record<string, unknown>) {
    return this.entityModel.findOne(filterQuery, {
      __v: 0,
      ...projection,
    });
  }

  find(filterQuery: FilterQuery<T>, projection?: Record<string, unknown>) {
    return this.entityModel.find(filterQuery, projection);
  }

  async create(createEntityModel: unknown): Promise<T | T[]> {
    if (Array.isArray(createEntityModel)) {
      return this.entityModel.insertMany(createEntityModel);
    } else {
      return this.entityModel.insertOne(createEntityModel);
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityModel: UpdateQuery<unknown>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return this.entityModel
      .findOneAndUpdate(filterQuery, updateEntityModel, options)
      .exec();
  }

  async deleteMany(filterQuery?: FilterQuery<T>): Promise<boolean> {
    const query = filterQuery || {};
    const res = await this.entityModel.deleteMany(query);
    return res.deletedCount >= 1;
  }
}
