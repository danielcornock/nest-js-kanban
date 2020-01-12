import { StoryService } from './story.service';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { IStory } from '../model/story';
import { Model } from 'mongoose';
import { BoardService } from '../../board/service/board.service';
import { BoardServiceStub } from '../../board/service/board.service.stub';
import { RepoFactoryStub } from '../../shared/database/factory/repo.factory.stub';

describe('StoryService', () => {
  let service: StoryService,
    repo: RepoFactory<IStory>,
    result: any,
    dependencies: {
      mongooseModel: Model<IStory>;
      boardService: BoardService;
    };

  beforeEach(async () => {
    dependencies = {
      mongooseModel: (new MongooseModelMock() as unknown) as Model<IStory>,
      boardService: (new BoardServiceStub() as unknown) as BoardService
    };

    repo = (new RepoFactoryStub() as Partial<RepoFactory<IStory>>) as RepoFactory<IStory>;

    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = new StoryService(dependencies.mongooseModel, dependencies.boardService);
  });

  describe('when creating a story', () => {
    beforeEach(() => {
      (repo.createEntity as jest.Mock).mockReturnValue({
        title: 'story-1'
      });
    });

    describe('when a board is found with a story number', () => {
      beforeEach(() => {
        (dependencies.boardService.fetchBoardStoryNumber as jest.Mock).mockResolvedValue({
          storyNumAccum: 1,
          title: 'board-id'
        });
      });

      describe('when the story and the board save successfully', () => {
        beforeEach(() => {
          (dependencies.boardService.update as jest.Mock).mockResolvedValue({
            title: 'updated-board'
          });

          (repo.save as jest.Mock).mockResolvedValue({
            title: 'updated-story'
          });

          result = service.createStory({ title: 'story-title' } as IStory, 'board-id', 'user-id');
        });

        it('should create an entity for the story', () => {
          expect(repo.createEntity).toHaveBeenCalledWith(dependencies.mongooseModel, { title: 'story-title', user: 'user-id' });
        });

        it('should find the matching board', () => {
          expect(dependencies.boardService.fetchBoardStoryNumber).toHaveBeenCalledWith({ _id: 'board-id' }, 'user-id');
        });

        it('should save the story with the story number', () => {
          expect(repo.save).toHaveBeenCalledWith({ title: 'story-1', storyNumber: 2 });
        });

        it('should save the updated board', () => {
          expect(dependencies.boardService.update).toHaveBeenCalledWith(
            {
              title: 'board-id',
              storyNumAccum: 2
            },
            'user-id',
            { _id: 'board-id' }
          );
        });

        it('should return the updated story', async () => {
          expect(await result).toEqual({
            title: 'updated-story'
          });
        });
      });
    });

    describe('when the story number is not set', () => {
      beforeEach(() => {
        (dependencies.boardService.fetchBoardStoryNumber as jest.Mock).mockResolvedValue({
          title: 'board-id'
        });

        result = service.createStory({ title: 'story-title' } as IStory, 'board-id', 'user-id');
      });

      it('should set the story number as 1', () => {
        expect(repo.save).toHaveBeenCalledWith({
          storyNumber: 1,
          title: 'story-1'
        });
      });
    });
  });
});
