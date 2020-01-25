import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { IBoard } from '../model/board';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { Model } from 'mongoose';
import { IParams } from '../../config/interfaces/params.interface';
import { BoardConfigService } from '../../board-config/services/board-config.service';
import { defaultConfigValues } from '../../board-config/model/default-config-values';

@Injectable()
export class BoardService extends CrudService<IBoard> {
  constructor(@Inject(MongooseModel.BOARD) boardModel: Model<IBoard>, private readonly _boardConfigService: BoardConfigService) {
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

  public async createBoard(body: Partial<IBoard>, userId: string): Promise<IBoard> {
    const board = this._create(body, userId);
    const savedBoard = await this._save(board);
    await this._boardConfigService.create({ board: savedBoard._id, ...defaultConfigValues }, userId);

    return savedBoard;
  }

  // TODO - add a function for the logic for adding the story to the board is moved to the API instead of the UI
}
