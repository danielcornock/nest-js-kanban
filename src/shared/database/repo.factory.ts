import { IParams } from '../../config/interfaces/params.interface';
import { Model } from 'mongoose';

export class RepoFactory<M> {
  private readonly _model;

  constructor(model: any) {
    this._model = model;
  }

  public static create<M>(model: any): RepoFactory<M> {
    return new RepoFactory<M>(model);
  }

  public findOne(query: IParams) {
    return this._model.findOne(query);
  }

  public save(data: any) {
    return data.save();
  }
}
