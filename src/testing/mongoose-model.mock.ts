export class MongooseModelMock {
  constructor(public data?: any) {}

  public save = jest.fn();

  public select = jest.fn();

  public findOne = jest.fn();

  public deleteOne = jest.fn();

  public find = jest.fn();

  public static findOne = jest.fn();
}
