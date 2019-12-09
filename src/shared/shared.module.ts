import { Module, Global } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [],
})
export class SharedModule {}
