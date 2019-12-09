import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthServiceMock } from '../service/auth.service.mock';
import { IUser } from '../user';

interface IAuthRes {
  jwt: string;
  user: IUser;
}

describe('Auth Controller', () => {
  let controller: AuthController, service: AuthService, mockUserRes: IUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    mockUserRes = {
      name: 'Tester',
      email: 'tester@mail.com',
      password: 'password',
      _id: '0000',
    } as IUser;

    jest.spyOn(service, 'createJwt');
  });

  describe('when registering a new user', () => {
    let mockUserReq: IUser, returnValue: IAuthRes;

    beforeEach(async () => {
      mockUserReq = {
        name: 'Tester',
        email: 'tester@mail.com',
        password: 'password',
      } as IUser;
    });

    describe('when the register method resolves successfully', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'register').mockResolvedValue(mockUserRes);
        returnValue = await controller.register(mockUserReq);
      });

      it('should call the register method within the auth service', () => {
        expect(service.register).toHaveBeenCalledWith(mockUserReq);
      });

      it('should create a jwt token', () => {
        expect(service.createJwt).toHaveBeenCalledWith('Tester', '0000');
      });

      it('should return the jwt and user object', () => {
        expect(returnValue).toEqual({ jwt: 'jwttoken', user: mockUserRes });
      });
    });

    describe('when the register method rejects', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'register').mockRejectedValue('fail');
        returnValue = await controller.register(mockUserReq);
      });

      it('should not fetch the JWT token', () => {
        expect(service.createJwt).not.toHaveBeenCalled();
      });

      it('should not attempt to return the user', () => {
        expect(returnValue).toBe(undefined);
      });
    });
  });

  describe('when attempting to log in', () => {
    let mockUserReq: IUser, returnValue: IAuthRes;

    beforeEach(() => {
      mockUserReq = {
        email: 'test@test.com',
        password: 'password',
      } as IUser;
    });

    describe('when the log in method resolves successfully', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'login').mockResolvedValue(mockUserRes);
        returnValue = await controller.login(mockUserReq);
      });

      it('should call the login method within the auth service', () => {
        expect(service.login).toHaveBeenCalledWith(mockUserReq);
      });

      it('should create a jwt token', () => {
        expect(service.createJwt).toHaveBeenCalledWith('Tester', '0000');
      });

      it('should return the jwt and user object', () => {
        expect(returnValue).toEqual({ jwt: 'jwttoken', user: mockUserRes });
      });
    });

    describe('when the log in method rejects', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'login').mockRejectedValue('fail');
        returnValue = await controller.login(mockUserReq);
      });

      it('should not fetch the JWT token', () => {
        expect(service.createJwt).not.toHaveBeenCalled();
      });

      it('should not attempt to return the user', () => {
        expect(returnValue).toBe(undefined);
      });
    });
  });
});
