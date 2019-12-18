import { ResponseInterceptor } from './response.interceptor';
import { BehaviorSubject } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { IUser } from 'src/auth/model/user';

interface IUserRes {
  user: Partial<IUser>;
}

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor,
    result,
    next: CallHandler,
    context: ExecutionContext,
    responseSubject: BehaviorSubject<IUserRes>;
  beforeEach(() => {
    interceptor = new ResponseInterceptor();

    responseSubject = new BehaviorSubject({
      user: ({
        _id: 'hello',
        __v: '0',
        password: 'password',
      } as unknown) as IUser,
    });

    context = {} as ExecutionContext;

    next = {
      handle: () => {
        return responseSubject.asObservable();
      },
    };

    jest.spyOn(next, 'handle');
  });

  describe('when intercept is called', () => {
    beforeEach(() => {
      result = interceptor.intercept(context, next);
    });

    it('should call the handle on the next object', () => {
      expect(next.handle).toHaveBeenCalledWith();
    });

    describe('when there is a password and __v entry in the response object', () => {
      it('should set them as undefined', done => {
        result.subscribe(data => {
          expect(data).toEqual({
            user: { _id: 'hello', __v: undefined, password: undefined },
          });
          done();
        });
      });
    });
  });
});
