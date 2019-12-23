import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { authProviders } from './providers/auth.providers';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders],
  exports: [AuthService, ...authProviders]
})
export class AuthModule {}
