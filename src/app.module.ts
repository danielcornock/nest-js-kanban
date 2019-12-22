import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import * as env from './config/env/env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './shared/interceptors/response/response.interceptor';
import { StoryModule } from './story/story.module';

@Module({
  imports: [AuthModule, SharedModule, StoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
