export class AuthServiceMock {
  public register = jest.fn();

  public createJwt = jest.fn();

  public login = jest.fn();

  public fetchUser = jest.fn();
}
