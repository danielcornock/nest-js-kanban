import { Routes } from 'nest-router';
import { StoryModule } from '../story/story.module';
import { BoardModule } from '../board/board.module';
import { BoardConfigModule } from '../board-config/board-config.module';
import * as routeProviders from './routes.providers';

export const routes: Routes = [
  {
    path: routeProviders.storyRouteProviders(),
    module: StoryModule
  },
  {
    path: routeProviders.routes.board,
    module: BoardModule
  },
  {
    path: routeProviders.routes.boardConfig,
    module: BoardConfigModule
  }
];
