import { Injectable, Inject } from '@nestjs/common';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { IBoardConfig } from '../model/board-config';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { Model } from 'mongoose';

@Injectable()
export class BoardConfigService extends CrudService<IBoardConfig> {
  constructor(@Inject(MongooseModel.BOARD_CONFIG) boardConfigModel: Model<IBoardConfig>) {
    super(boardConfigModel);
  }
}
