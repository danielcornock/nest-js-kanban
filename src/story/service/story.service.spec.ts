import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from './story.service';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { IStory } from '../model/story';
import { Model } from 'mongoose';
import { MongooseModel } from '../../shared/database/mongoose/constants';

describe('StoryService', () => {
  let service: StoryService, repo: RepoFactory<IStory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        {
          provide: MongooseModel.STORY,
          useValue: MongooseModelMock,
        },
      ],
    }).compile();

    repo = RepoFactory.create<IStory>(
      (MongooseModelMock as Partial<Model<IStory>>) as Model<IStory>,
    );
    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = module.get<StoryService>(StoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
