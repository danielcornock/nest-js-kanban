interface ICollectionInstance<T> {
  [key: string]: Array<T>;
}

export type ICollectionPromise<T> = Promise<ICollectionInstance<T>>;
