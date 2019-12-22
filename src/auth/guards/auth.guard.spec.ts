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
import * as util from '../../config/utilties/utilities';
import * as promFn from '../../config/utilties/promisifiedFn';
import { promisifySpy } from '../../config/utilties/utilities.test';

describe('AuthGuard', () => {
  let guard: AuthGuard,
    authService: AuthService,
    context: ExecutionContext,
    http: Partial<HttpArgumentsHost>,
    validRequest: any,
    invalidRequest: any,
    fetchUserSpy;

  beforeEach(() => {
    authService = (new AuthServiceMock() as unknown) as AuthService;
    guard = new AuthGuard(authService);

    fetchUserSpy = jest.spyOn(authService, 'fetchUser');

    validRequest = {
      headers: {
        authorization: 'Bearer jwt',
      },
    };

    invalidRequest = {
      headers: {
        authorization: '',
      },
    };
    http = {
      getRequest: jest.fn(),
    };

    context = ({
      switchToHttp: jest.fn().mockReturnValue(http),
    } as unknown) as ExecutionContext;
  });

  describe('when calling canActivate', () => {
    let result: Promise<boolean>;

    describe('when a jwt is supplied', () => {
      beforeEach(() => {
        (http.getRequest as jest.Mock).mockReturnValue(validRequest);
      });

      describe('when the jwt can be verified', () => {
        beforeEach(() => {
          //* Promisify is used for JWT-Compare
          promisifySpy.mockResolvedValue({ id: '0000' });
        });

        describe('when a user can be found', () => {
          beforeEach(() => {
            fetchUserSpy.mockResolvedValue({ email: 'dan@me.com' });
            result = guard.canActivate(context) as Promise<boolean>;
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

          it('should fetch the user', () => {
            expect(authService.fetchUser).toHaveBeenCalledWith({ _id: '0000' });
          });

          describe('when the guard has finished running', () => {
            let resolvedResult: boolean;

            beforeEach(async () => {
              resolvedResult = await result;
            });

            it('should return true', () => {
              expect(resolvedResult).toBe(true);
            });

            it('should attach the user to the request body', () => {
              expect(validRequest.user).toEqual({ email: 'dan@me.com' });
            });
          });
        });

        describe('when a user cannot be found', () => {
          beforeEach(() => {
            fetchUserSpy.mockResolvedValue(null);
            result = guard.canActivate(context) as Promise<boolean>;
          });

          it('should throw an error', async () => {
            expect(guard.canActivate).toThrow();
          });
        });

        describe('when something goes wrong when finding the user', () => {
          beforeEach(() => {
            fetchUserSpy.mockRejectedValue('reject');
            guard.canActivate(context);
          });

          it('should throw an error', () => {
            expect(guard.canActivate).toThrow();
          });
        });
      });

      describe('when the jwt is not valid', () => {
        beforeEach(() => {
          promisifySpy.mockRejectedValue('reject');
          result = guard.canActivate(context) as Promise<boolean>;
        });

        it('should throw an error', async () => {
          expect(await result).toBe(false);
        });
      });
    });

    describe('when a jwt is not supplied', () => {
      beforeEach(() => {
        (http.getRequest as jest.Mock).mockReturnValue(invalidRequest);
        result = guard.canActivate(context) as Promise<boolean>;
      });

      it('should return false', async () => {
        expect(await result).toBe(false);
      });
    });
  });
});
