export class MongooseQueryMock {
  public select = jest.fn();

  public populate = jest.fn();

  public exec = jest.fn();
}
