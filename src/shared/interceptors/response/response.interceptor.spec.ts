import { ResponseInterceptor } from './response.interceptor';
import { BehaviorSubject } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { IUser } from 'src/auth/model/user';

interface IUserRes {
  user: Partial<IUser>;
}

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor, result, next: CallHandler, context: ExecutionContext, responseSubject: BehaviorSubject<IUserRes>;
  beforeEach(() => {
    interceptor = new ResponseInterceptor();

    responseSubject = new BehaviorSubject({
      user: ({
        _id: 'hello',
        __v: '0',
        password: 'password'
      } as unknown) as IUser,
      array: [{ _id: 'arrayObj', __v: '0' }]
    });

    context = {} as ExecutionContext;

    next = {
      handle: () => {
        return responseSubject.asObservable();
      }
    };

    jest.spyOn(next, 'handle');
  });

  describe('when intercept is called', () => {
    describe('when there is no value in the response', () => {
      beforeEach(() => {
        responseSubject.next(undefined);
        result = interceptor.intercept(context, next);
      });

      it('should return undefined', done => {
        result.subscribe(data => {
          expect(data).toBeUndefined();
          done();
        });
      });
    });

    describe('when there is a password and __v entry in the response object', () => {
      beforeEach(() => {
        result = interceptor.intercept(context, next);
      });

      it('should call the handle on the next object', () => {
        expect(next.handle).toHaveBeenCalledWith();
      });

      it('should set them as undefined', done => {
        result.subscribe(data => {
          expect(data).toEqual({
            user: { _id: 'hello', __v: undefined, password: undefined },
            array: [{ _id: 'arrayObj' }]
          });
          done();
        });
      });
    });
  });
});
