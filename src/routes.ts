import { Routes } from 'nest-router';
import { StoryModule } from './story/story.module';
import { BoardModule } from './board/board.module';

export const routes: Routes = [
  {
    path: '/boards/:storyId/stories|/stories',
    module: StoryModule
  },
  {
    path: 'boards',
    module: BoardModule
  }
];
