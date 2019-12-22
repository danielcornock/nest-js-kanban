import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryService } from './service/story.service';
import { storySchema } from './model/story';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../auth/service/auth.service';
import { AuthModule } from '../auth/auth.module';
import { storyProviders } from './providers/story.providers';

@Module({
  imports: [AuthModule],
  controllers: [StoryController],
  providers: [StoryService, ...storyProviders],
})
export class StoryModule {}