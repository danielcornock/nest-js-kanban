import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Req, Put, Param, Get } from '@nestjs/common';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IBoard } from '../model/board';
import { BoardService } from '../service/board.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BoardDTO } from '../data/board.dto';
import { IReq } from '../../config/interfaces/middleware-params.interface';
import { IModelPromise } from '../../config/interfaces/http/model-response.interface';

@Controller()
@UseGuards(AuthGuard)
export class BoardController extends BaseController<IBoard, BoardService> {
  constructor(boardService: BoardService) {
    super(boardService, { singular: 'board', plural: 'boards' });
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() body: BoardDTO, @Req() req: IReq): IModelPromise<IBoard> {
    const board = await this._nativeService.create(body, req.user._id).catch(e => {
      throw e;
    });

    return { board };
  }

  @Put(`/:${this._nativeId}`)
  @UsePipes(ValidationPipe)
  public async update(@Body() body: BoardDTO, @Param(`${this._nativeId}`) _id: string, @Req() req: IReq): IModelPromise<IBoard> {
    const board = await this._nativeService.update(body, req.user._id, { _id }).catch(e => {
      throw e;
    });

    return { board };
  }
}
