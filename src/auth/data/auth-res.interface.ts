import { IUser } from '../model/user';

export interface IAuthInstance {
  jwt: string;
  user: IUser;
}

export type IAuthPromise = Promise<IAuthInstance>;
