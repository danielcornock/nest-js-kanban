interface IModelInstance<T> {
  [key: string]: T;
}

export type IModelPromise<T> = Promise<IModelInstance<T>>;
