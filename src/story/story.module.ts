import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryService } from './service/story.service';
import { AuthModule } from '../auth/auth.module';
import { storyProviders } from './providers/story.providers';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [AuthModule, BoardModule],
  controllers: [StoryController],
  providers: [StoryService, ...storyProviders]
})
export class StoryModule {}
