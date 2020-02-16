import { StoryController } from './story.controller';
import { StoryService } from '../service/story.service';
import { StoryServiceStub } from '../service/story.service.stub';
import { reqUserMock } from '../../testing/req-user.mock';
import { IStory } from '../model/story';
import { BoardService } from '../../board/service/board.service';
import { BoardServiceStub } from '../../board/service/board.service.stub';
import { ModelInstance } from '../../shared/http/model-instance';
import { ModelInstanceStub } from '../../shared/http/model-instance.stub';
import { storyDocumentNames } from '../providers/story.providers';
import { StubCreator } from '../../testing/stub-creator.service';

describe('Story Controller', () => {
  let controller: StoryController,
    storyService: StoryService,
    boardService: BoardService,
    result: any,
    modelInstanceStub: ModelInstanceStub;

  beforeEach(() => {
    boardService = StubCreator.create(BoardServiceStub);
    storyService = StubCreator.create(StoryServiceStub);

    modelInstanceStub = new ModelInstanceStub();
    jest.spyOn(ModelInstance, 'create').mockReturnValue(modelInstanceStub);

    controller = new StoryController(storyService, boardService);
  });

  describe('when updating a story', () => {
    describe('when a story is successfully updated', () => {
      beforeEach(async () => {
        (storyService.update as jest.Mock).mockResolvedValue('updatedStory');
        result = await controller.update({ title: 'test' } as IStory, 'storyId', reqUserMock);
      });

      it('should call the story storyService to update the story', () => {
        expect(storyService.update).toHaveBeenCalledWith({ title: 'test' }, 'userId', {
          _id: 'storyId'
        });
      });

      it('should create a model instance', () => {
        expect(ModelInstance.create).toHaveBeenCalledWith('updatedStory', storyDocumentNames);
      });

      it('should return the updated story', () => {
        expect(result).toBe(modelInstanceStub);
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (storyService.update as jest.Mock).mockRejectedValue('rejectedUpdate');
        controller
          .update({ title: 'test' } as IStory, 'storyId', reqUserMock)
          .catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedUpdate');
      });
    });
  });

  describe('when getting a story', () => {
    describe('when a story is successfully fetched', () => {
      beforeEach(async () => {
        (storyService.findOne as jest.Mock).mockResolvedValue('fetchedStory');

        result = await controller.findOneStory('native-id', reqUserMock);
      });

      it('should fetch the story', () => {
        expect(storyService.findOne).toHaveBeenCalledWith({ _id: 'native-id' }, 'userId');
      });

      it('should create the story model instance', () => {
        expect(ModelInstance.create).toHaveBeenCalledWith('fetchedStory', storyDocumentNames);
      });

      it('should return the model', () => {
        expect(result).toBe(modelInstanceStub);
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(() => {
        (storyService.findOne as jest.Mock).mockRejectedValue('err');

        controller.findOneStory('native-id', reqUserMock).catch(err => {
          result = err;
        });
      });

      it('should return the error', () => {
        expect(result).toBe('err');
      });
    });
  });

  describe('when creating a new story', () => {
    describe('when a story is successfully created', () => {
      beforeEach(async () => {
        (storyService.createStory as jest.Mock).mockResolvedValue('createdStory');

        (boardService.addStoryToBoard as jest.Mock).mockResolvedValue('');

        result = await controller.create(
          { title: 'test' } as IStory,
          reqUserMock,
          'board-id',
          'column-id'
        );
      });

      it('should call the story service to create the story', () => {
        expect(storyService.createStory).toHaveBeenCalledWith(
          { title: 'test' },
          'board-id',
          'userId'
        );
      });

      it('should create the modeel instance', () => {
        expect(ModelInstance.create).toHaveBeenCalledWith('createdStory', storyDocumentNames);
      });

      it('should return the created story', () => {
        expect(result).toBe(modelInstanceStub);
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (storyService.createStory as jest.Mock).mockRejectedValue('rejectedCreate');
        controller
          .create({ title: 'test' } as IStory, reqUserMock, 'board-id', 'column-id')
          .catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedCreate');
      });
    });
  });
});
