import { Controller, Post, UsePipes, ValidationPipe, Body, Req, UseGuards, Put, Param, Get, Delete, HttpCode } from '@nestjs/common';
import { StoryService } from '../service/story.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { StoryDTO } from '../data/story.dto';
import { IReq } from '../../config/interfaces/middleware-params.interface';

@Controller('stories')
@UseGuards(AuthGuard)
export class StoryController {
  private readonly _storyService: StoryService;

  constructor(storyService: StoryService) {
    this._storyService = storyService;
  }

  @Get('/')
  public async findAll(@Req() req: IReq) {
    const stories = await this._storyService.findMany(req.user._id).catch(e => {
      throw e;
    });

    return { stories };
  }

  @Get('/:storyId')
  public async findOne(@Param('storyId') _id: string, @Req() req: IReq) {
    const story = await this._storyService.findOne({ _id }, req.user._id).catch(e => {
      throw e;
    });

    return { story };
  }

  @Post('/')
  @UsePipes(new ValidationPipe())
  public async create(@Body() body: StoryDTO, @Req() req: IReq) {
    const story = await this._storyService.create(body, req.user._id).catch(e => {
      throw e;
    });

    return { story };
  }

  @Put('/:storyId')
  @UsePipes(new ValidationPipe())
  public async update(@Body() body: StoryDTO, @Param('storyId') _id: string, @Req() req: IReq) {
    const story = await this._storyService.update(body, req.user._id, { _id }).catch(e => {
      throw e;
    });

    return { story: story };
  }

  @Delete('/:storyId')
  @HttpCode(204)
  public async delete(@Param('storyId') storyId: string, @Req() req: IReq) {
    await this._storyService.delete(storyId, req.user._id).catch(e => {
      throw e;
    });

    return;
  }
}
