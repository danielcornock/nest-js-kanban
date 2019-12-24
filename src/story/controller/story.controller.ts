import { Controller, Post, UsePipes, ValidationPipe, Body, Req, UseGuards, Put, Param } from '@nestjs/common';
import { StoryService } from '../service/story.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { StoryDTO } from '../data/story.dto';
import { IReq } from '../../config/interfaces/middleware-params.interface';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IStory } from '../model/story';

@Controller('stories')
@UseGuards(AuthGuard)
export class StoryController extends BaseController<IStory, StoryService> {
  constructor(storyService: StoryService) {
    super(storyService, { singular: 'story', plural: 'stories' });
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() body: StoryDTO, @Req() req: IReq) {
    const story = await this._nativeService.create(body, req.user._id).catch(e => {
      throw e;
    });

    return { story };
  }

  @Put(`:/${this._nativeId}`)
  @UsePipes(ValidationPipe)
  public async update(@Body() body: StoryDTO, @Param(`${this._nativeId}`) _id: string, @Req() req: IReq) {
    const story = await this._nativeService.update(body, req.user._id, { _id }).catch(e => {
      throw e;
    });

    return { story: story };
  }
}
