import { IUser } from '../model/user';

interface IAuthInstance {
  jwt: string;
  user: IUser;
}

export type IAuthPromise = Promise<IAuthInstance>;
