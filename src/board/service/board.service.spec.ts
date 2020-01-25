import { BoardService } from './board.service';
import { IBoard } from '../model/board';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { MongooseQueryMock } from '../../testing/mongoose-query.mock';
import { Model } from 'mongoose';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { RepoFactoryStub } from '../../shared/database/factory/repo.factory.stub';
import { NotFoundException } from '@nestjs/common';
import { BoardConfigService } from '../../board-config/services/board-config.service';
import { BoardConfigServiceStub } from '../../board-config/services/board-config.service.stub';
import { defaultConfigValues } from '../../board-config/model/default-config-values';

describe('BoardService', () => {
  let service: BoardService,
    dependencies: {
      mongooseModel: Model<IBoard>;
      boardConfigService: BoardConfigService;
      repo: RepoFactory<IBoard>;
    };

  beforeEach(async () => {
    dependencies = {
      mongooseModel: (new MongooseModelMock() as unknown) as Model<IBoard>,
      repo: (new RepoFactoryStub() as Partial<RepoFactory<IBoard>>) as RepoFactory<IBoard>,
      boardConfigService: (new BoardConfigServiceStub() as Partial<BoardConfigService>) as BoardConfigService
    };

    jest.spyOn(RepoFactory, 'create').mockReturnValue(dependencies.repo);

    service = new BoardService(dependencies.mongooseModel, dependencies.boardConfigService);
  });

  describe('when finding a board', () => {
    let mongooseQuery: MongooseQueryMock, result: Promise<Partial<IBoard>>;

    beforeEach(() => {
      mongooseQuery = new MongooseQueryMock();
      (dependencies.repo.findOne as jest.Mock).mockReturnValue(mongooseQuery);
      (mongooseQuery.populate as jest.Mock).mockReturnValue(mongooseQuery);
    });

    describe('when a board is found', () => {
      beforeEach(() => {
        (mongooseQuery.exec as jest.Mock).mockResolvedValue({ title: 'board-title' });

        result = service.findOne({ _id: 'board-id' }, 'user-id');
      });

      it('should search for a board based on the query', () => {
        expect(dependencies.repo.findOne).toHaveBeenCalledWith({ _id: 'board-id', user: 'user-id' });
      });

      it('should populate the stories in the response', () => {
        expect(mongooseQuery.populate).toHaveBeenCalledWith('columns.stories');
      });

      it('should populate the config in the response', () => {
        expect(mongooseQuery.populate).toHaveBeenCalledWith('config');
      });

      it('should return the data', async () => {
        expect(await result).toEqual({
          title: 'board-title'
        });
      });
    });

    describe('when a board is not found', () => {
      beforeEach(() => {
        (mongooseQuery.exec as jest.Mock).mockResolvedValue(undefined);

        result = service.findOne({ _id: 'board-id' }, 'user-id');
      });

      it('should throw an error', async () => {
        result.catch(e => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      });
    });
  });

  describe('when finding a board with the story number', () => {
    let mongooseQuery: MongooseQueryMock, result: Promise<Partial<IBoard>>;

    beforeEach(() => {
      mongooseQuery = new MongooseQueryMock();
      (dependencies.repo.findOne as jest.Mock).mockReturnValue(mongooseQuery);
    });

    describe('when a board is found', () => {
      beforeEach(() => {
        (mongooseQuery.select as jest.Mock).mockResolvedValue({ title: 'board-title', storyNumAccum: 4 });

        result = service.fetchBoardStoryNumber({ _id: 'board-id' }, 'user-id');
      });

      it('should search for a board based on the query', () => {
        expect(dependencies.repo.findOne).toHaveBeenCalledWith({ _id: 'board-id', user: 'user-id' });
      });

      it('should add the story number accumulation to the response', () => {
        expect(mongooseQuery.select).toHaveBeenCalledWith('+storyNumAccum');
      });

      it('should return the data', async () => {
        expect(await result).toEqual({
          title: 'board-title',
          storyNumAccum: 4
        });
      });
    });

    describe('when a board is not found', () => {
      beforeEach(() => {
        (mongooseQuery.populate as jest.Mock).mockResolvedValue(undefined);

        result = service.fetchBoardStoryNumber({ _id: 'board-id' }, 'user-id');
      });

      it('should throw an error', async () => {
        result.catch(e => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      });
    });
  });

  describe('when creating a board', () => {
    let result: Promise<IBoard>;

    describe('when creating the entity', () => {
      beforeEach(() => {
        (dependencies.repo.createEntity as jest.Mock).mockReturnValue('board');
      });

      describe('when saving the board', () => {
        beforeEach(() => {
          (dependencies.repo.save as jest.Mock).mockResolvedValue({ _id: 'board-id' });
        });

        describe('when creating the blank config entity', () => {
          beforeEach(() => {
            (dependencies.boardConfigService.create as jest.Mock).mockResolvedValue('config');
          });

          describe('when calling the function', () => {
            beforeEach(() => {
              result = service.createBoard({ title: 'test-board' } as IBoard, 'user-id');
            });

            it('should create the entity', () => {
              expect(dependencies.repo.createEntity).toHaveBeenCalledWith(dependencies.mongooseModel, { title: 'test-board', user: 'user-id' });
            });

            it('should save the board', () => {
              expect(dependencies.repo.save).toHaveBeenCalledWith('board');
            });

            it('should create the board config', () => {
              expect(dependencies.boardConfigService.create).toHaveBeenCalledWith({ board: 'board-id', ...defaultConfigValues }, 'user-id');
            });

            it('should return the saved board', async () => {
              expect(await result).toEqual({ _id: 'board-id' });
            });
          });
        });
      });
    });
  });
});
