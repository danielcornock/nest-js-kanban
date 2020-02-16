import { Document, Model, DocumentQuery } from 'mongoose';
import { RepoFactory, IDeleteQuery } from '../database/factory/repo.factory';
import { IParams } from 'src/config/interfaces/params.interface';

export abstract class BaseService<IDoc extends Document> {
  protected readonly _model: Model<IDoc>;
  private readonly _repo: RepoFactory<IDoc>;

  constructor(mongooseModel: Model<IDoc>) {
    this._model = mongooseModel;
    this._repo = RepoFactory.create<IDoc>(mongooseModel);
  }

  protected _create<DTO>(body: DTO, userId?: string): IDoc {
    return this._repo.createEntity(this._model, this._attachUserToBody(body, userId));
  }

  protected _save(document: IDoc): Promise<IDoc> {
    return this._repo.save(document);
  }

  protected _findOne(query: IParams, userId?: string): DocumentQuery<IDoc, IDoc, {}> {
    return this._repo.findOne(this._attachUserToParams(query, userId));
  }

  protected _findMany(userId: string, params?: IParams): DocumentQuery<Array<IDoc>, IDoc, {}> {
    return this._repo.findMany(this._attachUserToParams(params, userId));
  }

  protected _delete(query: IParams, userId: string): IDeleteQuery {
    return this._repo.delete(this._attachUserToParams(query, userId));
  }

  private _attachUserToParams(params: IParams, user: string): IParams {
    if (!params) return { user };
    if (!user) return params;
    return { ...params, user };
  }

  private _attachUserToBody(body: Partial<IDoc>, user: string): IDoc {
    return ({ ...body, user } as Partial<IDoc>) as IDoc;
  }
}
