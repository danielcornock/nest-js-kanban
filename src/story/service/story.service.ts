import { Injectable, Inject } from '@nestjs/common';
import { IStory } from '../model/story';
import { Model } from 'mongoose';
import { CrudService } from '../../shared/abstracts/crud-service/crud-service.abstract';
import { MongooseModel } from '../../shared/database/mongoose/constants';

@Injectable()
export class StoryService extends CrudService<IStory> {
  constructor(@Inject(MongooseModel.STORY) storyModel: Model<IStory>) {
    super(storyModel);
  }
}
