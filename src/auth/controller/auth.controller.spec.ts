import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthServiceMock } from '../service/auth.service.stub';
import { IUser } from '../model/user';
import { IAuthInstance } from '../data/auth-res.interface';
import { StubCreator } from '../../testing/stub-creator.service';

describe('Auth Controller', () => {
  let controller: AuthController, service: AuthService, mockUserRes: IUser;

  beforeEach(async () => {
    service = StubCreator.create(AuthServiceMock);
    controller = new AuthController(service);
  });

  beforeEach(() => {
    mockUserRes = {
      name: 'Tester',
      email: 'tester@mail.com',
      password: 'password',
      _id: '0000'
    } as IUser;

    (service.createJwt as jest.Mock).mockReturnValue('jwttoken');
  });

  describe('when registering a new user', () => {
    let mockUserReq: IUser, returnValue: IAuthInstance;

    beforeEach(async () => {
      mockUserReq = {
        name: 'Tester',
        email: 'tester@mail.com',
        password: 'password'
      } as IUser;
    });

    describe('when the user registers successfully', () => {
      beforeEach(async () => {
        (service.register as jest.Mock).mockResolvedValue(mockUserRes);
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

    describe('when something goes wrong when registering', () => {
      beforeEach(() => {
        (service.register as jest.Mock).mockRejectedValue('registerRejected');
        controller.register(mockUserReq).catch(e => {
          returnValue = e;
        });
      });

      it('should return the error thrown', () => {
        expect(returnValue).toBe('registerRejected');
      });
    });
  });

  describe('when attempting to log in', () => {
    let mockUserReq: IUser, returnValue: IAuthInstance;

    beforeEach(() => {
      mockUserReq = {
        email: 'test@test.com',
        password: 'password'
      } as IUser;
    });

    describe('when the user logs in successfully', () => {
      beforeEach(async () => {
        (service.login as jest.Mock).mockResolvedValue(mockUserRes);
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

    describe('when something goes wrong when logging in', () => {
      beforeEach(() => {
        (service.login as jest.Mock).mockRejectedValue('loginRejected');
        controller.login(mockUserReq).catch(e => {
          returnValue = e;
        });
      });

      it('should return the error', () => {
        expect(returnValue).toBe('loginRejected');
      });
    });
  });
});
