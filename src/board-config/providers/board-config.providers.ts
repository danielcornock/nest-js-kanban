import { MongooseModel } from 'src/shared/database/mongoose/constants';
import { Connection } from 'mongoose';
import { boardConfigSchema } from '../model/board-config';
import { Database } from 'src/shared/database/constants';

export const boardConfigProviders = [
  {
    provide: MongooseModel.BOARD_CONFIG,
    useFactory: (connection: Connection) => connection.model('BoardConfig', boardConfigSchema),
    inject: [Database.CONNECTION]
  }
];
