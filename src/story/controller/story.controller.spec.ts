import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from './story.controller';
import { StoryService } from '../service/story.service';
import { StoryServiceStub } from '../service/story.service.stub';
import { AuthModule } from '../../auth/auth.module';
import { reqUserMock } from '../../testing/req-user.mock';
import { IStory } from '../model/story';

describe('Story Controller', () => {
  let controller: StoryController, service: StoryService, result: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [StoryController],
      providers: [{ provide: StoryService, useClass: StoryServiceStub }]
    }).compile();

    controller = module.get<StoryController>(StoryController);
    service = module.get<StoryService>(StoryService);
  });

  describe('when updating a story', () => {
    describe('when a story is successfully updated', () => {
      beforeEach(async () => {
        (service.update as jest.Mock).mockResolvedValue('updatedStory');
        result = await controller.update({ title: 'test' } as IStory, 'storyId', reqUserMock);
      });

      it('should call the story service to update the story', () => {
        expect(service.update).toHaveBeenCalledWith({ title: 'test' }, 'userId', {
          _id: 'storyId'
        });
      });

      it('should return the updated story', () => {
        expect(result).toEqual({ story: 'updatedStory' });
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.update as jest.Mock).mockRejectedValue('rejectedUpdate');
        controller.update({ title: 'test' } as IStory, 'storyId', reqUserMock).catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedUpdate');
      });
    });
  });

  describe('when creating a new story', () => {
    describe('when a story is successfully created', () => {
      beforeEach(async () => {
        (service.createStory as jest.Mock).mockResolvedValue('createdStory');
        result = await controller.create({ title: 'test' } as IStory, reqUserMock, 'board-id');
      });

      it('should call the story service to create the story', () => {
        expect(service.createStory).toHaveBeenCalledWith({ title: 'test' }, 'board-id', 'userId');
      });

      it('should return the created story', () => {
        expect(result).toEqual({ story: 'createdStory' });
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.createStory as jest.Mock).mockRejectedValue('rejectedCreate');
        controller.create({ title: 'test' } as IStory, reqUserMock, 'board-id').catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedCreate');
      });
    });
  });
});
