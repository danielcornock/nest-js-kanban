import { Module, Global } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RepoService } from './database/repo.factory';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [RepoService],
})
export class SharedModule {}
