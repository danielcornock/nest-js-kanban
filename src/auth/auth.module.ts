import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './model/user';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
