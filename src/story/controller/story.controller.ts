import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Req,
  UseGuards,
  Put,
  Param,
  Get
} from '@nestjs/common';
import { StoryService } from '../service/story.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { StoryDTO } from '../data/story.dto';
import { IReq } from '../../config/interfaces/middleware-params.interface';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IStory } from '../model/story';
import { IModelPromise } from '../../config/interfaces/http/model-response.interface';
import { BoardService } from '../../board/service/board.service';
import { storyDocumentNames } from '../providers/story.providers';
import { ModelInstance } from '../../shared/http/model-instance';

@Controller()
@UseGuards(AuthGuard)
export class StoryController extends BaseController<IStory, StoryService> {
  constructor(storyService: StoryService, private readonly _boardService: BoardService) {
    super(storyService, storyDocumentNames);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(
    @Body() body: StoryDTO,
    @Req() req: IReq,
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string
  ): IModelPromise<IStory> {
    const story = await this._nativeService.createStory(body, boardId, req.user._id).catch(e => {
      throw e;
    });

    await this._boardService.addStoryToBoard(story._id, columnId, boardId, req.user._id);

    return ModelInstance.create(story, storyDocumentNames);
  }

  @Put(`/:${this._nativeId}`)
  @UsePipes(ValidationPipe)
  public async update(
    @Body() body: StoryDTO,
    @Param(`${this._nativeId}`) _id: string,
    @Req() req: IReq
  ): IModelPromise<IStory> {
    const story = await this._nativeService.update(body, req.user._id, { _id }).catch(e => {
      throw e;
    });

    return ModelInstance.create(story, storyDocumentNames);
  }

  @Get(`/:${this._nativeId}`)
  public async findOneStory(
    @Param(`${this._nativeId}`) _id: string,
    @Req() req: IReq
  ): IModelPromise<IStory> {
    const story = await this._nativeService.findOne({ _id }, req.user._id).catch(e => {
      throw e;
    });

    return ModelInstance.create(story, storyDocumentNames);
  }
}
