import { Module } from '@nestjs/common';
import { BoardConfigController } from './controller/board-config.controller';
import { BoardConfigService } from './services/board-config.service';
import { boardConfigProviders } from 'src/board-config/providers/board-config.providers';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BoardConfigController],
  providers: [BoardConfigService, ...boardConfigProviders],
  exports: [BoardConfigService]
})
export class BoardConfigModule {}
