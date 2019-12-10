import { IUser } from './user';

export class UserModelMock {
  constructor(public data?: any) {}
  public user;

  save() {
    const model = new UserModelMock();
    model.data = {
      email: 'tester@mail.com',
      name: 'Tester',
      password: '####',
    };
    return model.data;
  }

  select() {
    return new Promise((resolve, reject) => {
      resolve({
        email: 'tester@mail.com',
        name: 'Tester',
        password: '####',
        _id: '0000',
      });
    });
  }

  static findOne(any) {
    const model = new UserModelMock();
    model.data = {
      email: 'tester@mail.com',
      name: 'Tester',
      password: '####',
    };

    return model;
  }
}
