import { IUser } from '../model/user';
import { RegisterDTO } from '../data/auth.dto';

export class AuthServiceMock {
  public async register(body: RegisterDTO): Promise<IUser> {
    return {} as IUser;
  }

  public createJwt(): string {
    return 'jwttoken';
  }

  public async login(): Promise<IUser> {
    return {} as IUser;
  }

  public async fetchUser(): Promise<IUser> {
    return {} as IUser;
  }
}
