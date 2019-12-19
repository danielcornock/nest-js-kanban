import { IUser } from '../model/user';

export interface IAuthRes {
  jwt: string;
  user: IUser;
}
