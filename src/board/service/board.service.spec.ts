import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { IBoard } from '../model/board';
import { MongooseModel } from '../../shared/database/mongoose/constants';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { Model } from 'mongoose';

describe('BoardService', () => {
  let service: BoardService, repo: RepoFactory<IBoard>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: MongooseModel.BOARD,
          useValue: MongooseModelMock
        }
      ]
    }).compile();

    repo = RepoFactory.create<IBoard>((MongooseModelMock as Partial<Model<IBoard>>) as Model<IBoard>);
    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
