import { BaseService } from '../base-service.abstract';
import { Document, Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { IParams } from 'src/config/interfaces/params.interface';

export abstract class CrudService<IDoc extends Document> extends BaseService<IDoc> {
  constructor(mongooseModel: Model<IDoc>) {
    super(mongooseModel);
  }

  public async findOne(query: IParams, userId: string): Promise<IDoc> {
    const doc = await this._findOne(query, userId);
    if (!doc) throw new NotFoundException('The item you are looking for cannot be found!');

    return doc;
  }

  public async findMany(userId: string) {
    return await this._findMany(userId);
  }

  public async create(body: Partial<IDoc>, userId: string): Promise<IDoc> {
    const story = this._create(body, userId);
    return await this._save(story);
  }

  public async update(body: Partial<IDoc>, userId: string, params: IParams): Promise<IDoc> {
    const document = await this._findOne(params, userId);
    if (!document) {
      throw new NotFoundException('The item you are trying to edit cannot be found!');
    }
    Object.assign(document, body);
    return await this._save(document);
  }

  public async delete(docId: string, userId: string): Promise<void> {
    const result = await this._delete({ _id: docId }, userId);
    if (!result.deletedCount) {
      throw new NotFoundException('The item you are trying to delete cannot be found!');
    }
  }
}
