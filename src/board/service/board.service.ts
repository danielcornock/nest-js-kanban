import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { IBoard, IColumn } from '../model/board';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { Model } from 'mongoose';
import { IParams } from '../../config/interfaces/params.interface';
import { BoardConfigService } from '../../board-config/services/board-config.service';
import { defaultConfigValues } from '../../board-config/model/default-config-values';

@Injectable()
export class BoardService extends CrudService<IBoard> {
  constructor(
    @Inject(MongooseModel.BOARD) boardModel: Model<IBoard>,
    private readonly _boardConfigService: BoardConfigService
  ) {
    super(boardModel);
  }

  public async findOne(query: IParams, userId: string): Promise<IBoard> {
    const doc = await await this._findOne(query, userId)
      .populate('columns.stories')
      .populate('config')
      .exec();
    if (!doc) throw new NotFoundException('The item you are looking for cannot be found!');

    return doc;
  }

  public async fetchBoardStoryNumber(query: IParams, userId: string): Promise<IBoard> {
    const doc = await this._findOne(query, userId).select('+storyNumAccum');
    if (!doc) throw new NotFoundException('The item you are looking for cannot be found!');

    return doc;
  }

  public async addStoryToBoard(
    storyId: string,
    columnId: string,
    boardId: string,
    userId: string
  ): Promise<IBoard> {
    const board: IBoard = await this._findOne({ _id: boardId }, userId);

    const column: any = this._findColumn(board, columnId);

    column.stories.push(storyId);

    await this._save(board);

    return;
  }

  private _findColumn(board: IBoard, columnId: string): IColumn {
    return board.columns.find((col: any) => {
      return col._id.toString() === columnId;
    });
  }

  public async createBoard(body: IBoard, userId: string): Promise<IBoard> {
    const board = this._create(body, userId);
    const savedBoard = await this._save(board);
    await this._boardConfigService.create(
      { board: savedBoard._id, ...defaultConfigValues },
      userId
    );

    return savedBoard;
  }

  public async updateBoard(body: IBoard, userId: string, params: IParams): Promise<IBoard> {
    const document = await this._findOne(params, userId);
    if (!document) {
      throw new NotFoundException('The item you are trying to edit cannot be found!');
    }

    Object.assign(document, body);
    await this._save(document);

    return await this.findOne(params, userId);
  }
}
