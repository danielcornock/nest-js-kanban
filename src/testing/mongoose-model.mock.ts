export class MongooseModelMock {
  constructor(public data?: any) {}

  public save(...args) {
    return undefined;
  }

  public select(...args) {
    return undefined;
  }

  public findOne(...args) {
    return undefined;
  }

  public deleteOne(...args) {
    return undefined;
  }

  public static findOne(...args) {
    return undefined;
  }
}
