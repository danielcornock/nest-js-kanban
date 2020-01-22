import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { StoryModule } from './story/story.module';
import { BoardModule } from './board/board.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';
import { BoardConfigModule } from './board-config/board-config.module';

@Module({
  imports: [RouterModule.forRoutes(routes), AuthModule, SharedModule, StoryModule, BoardModule, BoardConfigModule]
})
export class AppModule {
  constructor() {}
}
