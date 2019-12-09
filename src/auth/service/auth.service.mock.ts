import { RegisterDTO, IUser } from '../user';

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
}
