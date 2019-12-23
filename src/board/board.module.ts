import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { boardProviders } from './providers/board.providers';

@Module({
  imports: [AuthModule],
  providers: [...boardProviders]
})
export class BoardModule {}
