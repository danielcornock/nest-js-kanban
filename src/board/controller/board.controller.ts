import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Req,
  Put,
  Param,
  Get
} from '@nestjs/common';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IBoard } from '../model/board';
import { BoardService } from '../service/board.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BoardDTO } from '../data/board.dto';
import { IReq } from '../../config/interfaces/middleware-params.interface';
import { IModelPromiseDeprecated } from '../../config/interfaces/http/model-response-deprecated.interface';
import { IModelPromise } from '../../config/interfaces/http/model-response.interface';
import { ModelInstance } from '../../shared/http/model-instance';
import { boardDocumentNames } from '../providers/board.providers';
import { ICollectionPromise } from 'src/config/interfaces/http/collection-response.interface';

@Controller()
@UseGuards(AuthGuard)
export class BoardController extends BaseController<IBoard, BoardService> {
  constructor(boardService: BoardService) {
    super(boardService, boardDocumentNames);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() body: BoardDTO, @Req() req: IReq): IModelPromiseDeprecated<IBoard> {
    const board = await this._nativeService.createBoard(body as IBoard, req.user._id).catch(e => {
      throw e;
    });

    return { board };
  }

  @Get('/list')
  public async list(@Req() req: IReq): ICollectionPromise<Partial<IBoard>> {
    const documentList = await this._nativeService.list(req.user._id).catch(e => {
      throw e;
    });

    return { [this._names.plural]: documentList };
  }

  @Put(`/:${this._nativeId}`)
  @UsePipes(ValidationPipe)
  public async update(
    @Body() body: BoardDTO,
    @Param(`${this._nativeId}`) _id: string,
    @Req() req: IReq
  ): IModelPromise<IBoard> {
    const doc = await this._nativeService
      .updateBoard(body as IBoard, req.user._id, { _id })
      .catch(e => {
        throw e;
      });

    return ModelInstance.create(doc, this._names);
  }

  @Get(`/:${this._nativeId}`)
  public async findOneBoard(
    @Param(`${this._nativeId}`) _id: string,
    @Req() req: IReq
  ): IModelPromise<IBoard> {
    const doc = await this._nativeService.findOne({ _id }, req.user._id).catch(e => {
      throw e;
    });

    return ModelInstance.create(doc, this._names);
  }
}
