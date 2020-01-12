export class MongooseModelMock {
  public save = jest.fn();

  public findOne = jest.fn();

  public deleteOne = jest.fn();

  public find = jest.fn();

  public static findOne = jest.fn();
}
