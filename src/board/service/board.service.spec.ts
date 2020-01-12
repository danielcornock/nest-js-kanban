import { BoardService } from './board.service';
import { IBoard } from '../model/board';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { MongooseQueryMock } from '../../testing/mongoose-query.mock';
import { Model } from 'mongoose';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { RepoFactoryStub } from '../../shared/database/factory/repo.factory.stub';
import { NotFoundException } from '@nestjs/common';

describe('BoardService', () => {
  let service: BoardService,
    dependencies: {
      mongooseModel: Model<IBoard>;
      repo: RepoFactory<IBoard>;
    };

  beforeEach(async () => {
    dependencies = {
      mongooseModel: (new MongooseModelMock() as unknown) as Model<IBoard>,
      repo: (new RepoFactoryStub() as Partial<RepoFactory<IBoard>>) as RepoFactory<IBoard>
    };

    jest.spyOn(RepoFactory, 'create').mockReturnValue(dependencies.repo);

    service = new BoardService(dependencies.mongooseModel);
  });

  describe('when finding a board', () => {
    let mongooseQuery: MongooseQueryMock, result: Promise<Partial<IBoard>>;

    beforeEach(() => {
      mongooseQuery = new MongooseQueryMock();
      (dependencies.repo.findOne as jest.Mock).mockReturnValue(mongooseQuery);
    });

    describe('when a board is found', () => {
      beforeEach(() => {
        (mongooseQuery.populate as jest.Mock).mockResolvedValue({ title: 'board-title' });

        result = service.findOne({ _id: 'board-id' }, 'user-id');
      });

      it('should search for a board based on the query', () => {
        expect(dependencies.repo.findOne).toHaveBeenCalledWith({ _id: 'board-id', user: 'user-id' });
      });

      it('should populate the stories in the response', () => {
        expect(mongooseQuery.populate).toHaveBeenCalledWith('columns.stories');
      });

      it('should return the data', async () => {
        expect(await result).toEqual({
          title: 'board-title'
        });
      });
    });

    describe('when a board is not found', () => {
      beforeEach(() => {
        (mongooseQuery.populate as jest.Mock).mockResolvedValue(undefined);

        result = service.findOne({ _id: 'board-id' }, 'user-id');
      });

      it('should throw an error', async () => {
        result.catch(e => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
      });
    });
  });

  describe('when finding a board', () => {
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
});
