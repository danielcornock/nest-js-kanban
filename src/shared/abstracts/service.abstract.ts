import { Document, Model } from 'mongoose';
import { RepoFactory } from '../database/repo.factory';
import { IParams } from 'src/config/interfaces/params.interface';

export class BaseService<D extends Document> {
  protected readonly _model: Model<D>;
  protected readonly _repo: RepoFactory<D>;

  constructor(mongooseModel: Model<D>) {
    this._model = mongooseModel;
    this._repo = RepoFactory.create<D>(mongooseModel);
  }

  protected _create(body: Partial<D>) {
    return new this._model(body);
  }

  protected _save(document: D) {
    return this._repo.save(document);
  }

  protected _findOne(query: IParams) {
    return this._repo.findOne(query);
  }
}
