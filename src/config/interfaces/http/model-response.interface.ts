import { Document } from 'mongoose';

export interface IModelResponse<T extends Document> {
  data: IModelData<T>;
  meta: IModelMeta;
}

export interface IModelData<T extends Document> {
  [key: string]: T;
}

export interface IModelMeta {
  links: IModelLinks;
}

export interface IModelLinks {
  self: string;
  [key: string]: string;
}

export type IModelPromise<T extends Document> = Promise<IModelResponse<T>>;
