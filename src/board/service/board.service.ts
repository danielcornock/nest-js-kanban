import { Injectable, Inject } from '@nestjs/common';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { IBoard } from '../model/board';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { Model } from 'mongoose';

@Injectable()
export class BoardService extends CrudService<IBoard> {
  constructor(@Inject(MongooseModel.BOARD) boardModel: Model<IBoard>) {
    super(boardModel);
  }
}
