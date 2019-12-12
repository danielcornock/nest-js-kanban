import { IUser } from './user';

export class UserModelMock {
  constructor(public data?: any) {}
  public user;

  public save(data?: any) {
    const model = new UserModelMock();
    model.data = {
      email: 'tester@mail.com',
      name: 'Tester',
      password: '####',
    };
    return model.data;
  }

  public select(data: any) {
    return new Promise((resolve, reject) => {
      resolve({
        email: 'tester@mail.com',
        name: 'Tester',
        password: '####',
        _id: '0000',
      });
    });
  }

  public findOne(arg1, arg2) {
    return 'test';
  }

  public static findOne(any) {
    const model = new UserModelMock();
    model.data = {
      email: 'tester@mail.com',
      name: 'Tester',
      password: '####',
    };

    return model;
  }
}
