import { Connection } from 'mongoose';
import { userSchema } from '../model/user';
import { MongooseModel } from 'src/shared/database/mongoose/constants';
import { Database } from 'src/shared/database/constants';

export const authProviders = [
  {
    provide: MongooseModel.USER,
    useFactory: (connection: Connection) => connection.model('User', userSchema),
    inject: [Database.CONNECTION]
  }
];
