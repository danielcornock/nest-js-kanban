import { IParams } from '../../../config/interfaces/params.interface';
import { Model, Document, DocumentQuery, Query } from 'mongoose';

export class RepoFactory<D extends Document> {
  private readonly _model: Model<D>;

  constructor(model: Model<D>) {
    this._model = model;
  }

  public static create<Doc extends Document>(model: Model<Doc>): RepoFactory<Doc> {
    return new RepoFactory<Doc>(model);
  }

  public createEntity(model: Model<D>, data: D): D {
    return new model(data);
  }

  public findMany(query: IParams): DocumentQuery<Array<D>, D, {}> {
    return this._model.find(query);
  }

  public findOne(query: IParams): DocumentQuery<D, D, {}> {
    return this._model.findOne(query);
  }

  public save(data: D): Promise<D> {
    return data.save();
  }

  public delete(query: IParams): IDeleteQuery {
    return this._model.deleteOne(query);
  }
}

export type IDeleteQuery = Query<IDeleteOk & IDeleteCount>;

interface IDeleteOk {
  ok?: number;
  n?: number;
}

interface IDeleteCount {
  deletedCount?: number;
}
