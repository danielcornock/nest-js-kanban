import { Injectable, Inject } from '@nestjs/common';
import { IStory } from '../model/story';
import { Model } from 'mongoose';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { BoardService } from '../../board/service/board.service';
import { IBoard } from 'src/board/model/board';

@Injectable()
export class StoryService extends CrudService<IStory> {
  private readonly _boardService: BoardService;

  constructor(@Inject(MongooseModel.STORY) storyModel: Model<IStory>, boardService: BoardService) {
    super(storyModel);
    this._boardService = boardService;
  }

  public async createStory(body: Partial<IStory>, boardId: string, userId: string): Promise<IStory> {
    const story: IStory = this._create(body, userId);
    const board = await this._boardService.fetchBoardStoryNumber({ _id: boardId }, userId);

    this._bumpStoryNumber(board, story);

    const [updatedStory] = await Promise.all([this._save(story), this._boardService.update(board, userId, { _id: boardId })]);

    return updatedStory;
  }

  private _bumpStoryNumber(board: IBoard, story: IStory): void {
    if (board.storyNumAccum) {
      board.storyNumAccum++;
      story.storyNumber = board.storyNumAccum;
    } else {
      story.storyNumber = board.storyNumAccum = 1;
    }
  }
}
