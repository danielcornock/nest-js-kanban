import { AuthGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';
import { AuthServiceMock } from '../service/auth.service.mock';
import {
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { jwtSecret } from '../../config/env/env';
import * as util from '../../shared/utilties/utilities';
import * as promFn from '../../shared/utilties/promisifiedFn';
import { promisifySpy } from '../../shared/utilties/utilities.test';

describe('AuthGuard', () => {
  let guard: AuthGuard,
    authService: AuthService,
    context: ExecutionContext,
    http: Partial<HttpArgumentsHost>,
    request: any,
    fetchUserSpy;

  beforeEach(() => {
    authService = (new AuthServiceMock() as unknown) as AuthService;
    guard = new AuthGuard(authService);
    jest.spyOn(guard, 'canActivate');

    fetchUserSpy = jest.spyOn(authService, 'fetchUser');

    request = {
      headers: {
        authorization: 'Bearer jwt',
      },
    };
    http = {
      getRequest: jest.fn().mockReturnValue(request),
    };

    context = ({
      switchToHttp: jest.fn().mockReturnValue(http),
    } as unknown) as ExecutionContext;
  });

  describe('when calling canActivate', () => {
    let result: any;

    describe('on initialisation', () => {
      beforeEach(() => {
        guard.canActivate(context);
      });

      it('should switch the context to http', () => {
        expect(context.switchToHttp).toHaveBeenCalledWith();
      });

      it('should get the request', () => {
        expect(http.getRequest).toHaveBeenCalledWith();
      });

      it('should verify that the JWT is valid', () => {
        expect(promFn.promisifiedFn).toHaveBeenCalledWith('jwt', jwtSecret);
      });
    });

    describe('when the jwt can be verified', () => {
      beforeEach(() => {
        //* Promisify is used for JWT-Compare
        promisifySpy.mockResolvedValue({ id: '0000' });
        guard.canActivate(context);
      });

      it('should fetch the user', () => {
        expect(authService.fetchUser).toHaveBeenCalledWith({ _id: '0000' });
      });

      describe('when a user can be found', () => {
        beforeEach(() => {
          fetchUserSpy.mockResolvedValue({ email: 'dan@me.com' });

          result = guard.canActivate(context);
        });

        it('should return true', async () => {
          expect(await result).toBe(true);
        });

        describe('when the guard has finished running', () => {
          beforeEach(() => {
            guard.canActivate(context);
          });

          it('should attach the user to the request body', () => {
            expect(request.user).toEqual({ email: 'dan@me.com' });
          });
        });
      });

      describe('when a user cannot be found', () => {
        beforeEach(() => {
          fetchUserSpy.mockResolvedValue(null);
          result = guard.canActivate(context);
        });

        it('should throw a not found exception', async () => {
          expect(guard.canActivate).toThrow();
        });
      });

      describe('when finding a user rejects', () => {
        beforeEach(() => {
          fetchUserSpy.mockRejectedValue('reject');
        });

        it('should throw an internal server exception', () => {
          expect(guard.canActivate).toThrow();
        });
      });

      describe('when there is a database error', () => {
        beforeEach(() => {
          jest.spyOn(authService, 'fetchUser').mockRejectedValue('rejected');

          guard.canActivate(context);
        });

        it('should throw a internal server error', () => {
          expect(guard.canActivate).toThrow();
        });
      });
    });

    describe('when the jwt is not valid', () => {
      beforeEach(() => {
        promisifySpy.mockRejectedValue('reject');
        result = guard.canActivate(context);
      });

      it('should throw an error', async () => {
        expect(await result).toBe(false);
      });
    });
  });
});
