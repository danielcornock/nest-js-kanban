import { Connection } from 'mongoose';
import { storySchema } from '../model/story';
import { MongooseModel } from 'src/shared/database/mongoose/constants';
import { Database } from 'src/shared/database/constants';

export const storyProviders = [
  {
    provide: MongooseModel.STORY,
    useFactory: (connection: Connection) => connection.model('Story', storySchema),
    inject: [Database.CONNECTION]
  }
];

export const storyDocumentNames = { singular: 'story', plural: 'stories' };
