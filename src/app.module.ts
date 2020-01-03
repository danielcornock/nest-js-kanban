import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { StoryModule } from './story/story.module';
import { BoardModule } from './board/board.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';

@Module({
  imports: [RouterModule.forRoutes(routes), AuthModule, SharedModule, StoryModule, BoardModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor() {}
}
