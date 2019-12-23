import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(value => {
        if (!value) return value;
        for (let key of Object.keys(value)) {
          if (value[key].__v || value[key].__v === 0) {
            value[key].__v = undefined;
          }

          if (value[key].password) {
            value[key].password = undefined;
          }

          if (value[key] instanceof Array) {
            value[key].forEach(entry => {
              entry.__v = undefined;
            });
          }
        }
        return value;
      }),
    );
  }
}
