import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { IBoard } from '../model/board';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { Model } from 'mongoose';
import { IParams } from 'src/config/interfaces/params.interface';

@Injectable()
export class BoardService extends CrudService<IBoard> {
  constructor(@Inject(MongooseModel.BOARD) boardModel: Model<IBoard>) {
    super(boardModel);
  }

  public async findOne(query: IParams, userId: string): Promise<IBoard> {
    const doc = await this._findOne(query, userId).populate('columns.stories');
    if (!doc) throw new NotFoundException('The item you are looking for cannot be found!');

    return doc;
  }

  // TODO - add a function for the logic for adding the story to the board is moved to the API instead of the UI
}
