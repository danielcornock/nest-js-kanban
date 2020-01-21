import { Test, TestingModule } from '@nestjs/testing';
import { BoardConfigService } from './board-config.service';
import { IBoardConfig } from '../model/board-config';
import { Model } from 'mongoose';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { RepoFactoryStub } from '../../shared/database/factory/repo.factory.stub';

describe('BoardConfigService', () => {
  let service: BoardConfigService,
    repo: RepoFactory<IBoardConfig>,
    dependencies: {
      mongooseModel: Model<IBoardConfig>;
    };

  beforeEach(async () => {
    dependencies = {
      mongooseModel: (new MongooseModelMock() as unknown) as Model<IBoardConfig>
    };

    repo = (new RepoFactoryStub() as Partial<RepoFactory<IBoardConfig>>) as RepoFactory<IBoardConfig>;

    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = new BoardConfigService(dependencies.mongooseModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
