import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { boardProviders } from './providers/board.providers';
import { BoardService } from './service/board.service';
import { BoardController } from './controller/board.controller';

@Module({
  imports: [AuthModule],
  providers: [...boardProviders, BoardService],
  controllers: [BoardController],
  exports: [BoardService]
})
export class BoardModule {}
