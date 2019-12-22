import * as mongoose from 'mongoose';
import * as env from '../../../config/env/env';
import { Database } from '../constants';

export const databaseProviders = [
  {
    provide: Database.CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(env.database(env.environment), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
  },
];
