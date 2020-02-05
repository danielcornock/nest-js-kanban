interface IModelInstanceDeprecated<T> {
  [key: string]: T;
}

export type IModelPromiseDeprecated<T> = Promise<IModelInstanceDeprecated<T>>;
