import { Document, Model } from 'mongoose';
import { RepoService } from '../database/repo.factory';
import { IParams } from 'src/config/interfaces/params.interface';

export class BaseService<D extends Document> {
  protected readonly _model: Model<D>;
  protected readonly _repo: RepoService<D>;

  constructor(model: Model<D>) {
    this._model = model;
    this._repo = RepoService.create<D>(model);
  }

  protected _create(body: IParams) {
    return new this._model(body);
  }

  protected _save(document: D) {
    return this._repo.save(document);
  }

  protected _findOne(query: IParams) {
    return this._repo.findOne(query);
  }
}
