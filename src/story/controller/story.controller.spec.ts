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
      providers: [{ provide: StoryService, useClass: StoryServiceStub }],
    }).compile();

    controller = module.get<StoryController>(StoryController);
    service = module.get<StoryService>(StoryService);
  });

  describe('when finding all stories', () => {
    beforeEach(async () => {
      (service.findMany as jest.Mock).mockResolvedValue(['stories']);
      result = await controller.findAll(reqUserMock);
    });

    it('should call the story service to fetch all stories', () => {
      expect(service.findMany).toHaveBeenCalledWith('userId');
    });

    it('should return the stories', () => {
      expect(result).toEqual({ stories: ['stories'] });
    });
  });

  describe('when finding a story', () => {
    beforeEach(async () => {
      (service.findOne as jest.Mock).mockResolvedValue({
        _id: 'storyId',
      });

      result = await controller.findOne('storyId', reqUserMock);
    });

    it('should call the story service to fetch the story', () => {
      expect(service.findOne).toHaveBeenCalledWith(
        { _id: 'storyId' },
        'userId',
      );
    });

    it('should return the story', () => {
      expect(result).toEqual({ story: { _id: 'storyId' } });
    });
  });

  describe('when deleting a story', () => {
    beforeEach(async () => {
      (service.delete as jest.Mock).mockResolvedValue(undefined);
      result = await controller.delete('storyId', reqUserMock);
    });

    it('should call the story service to delete the story', () => {
      expect(service.delete).toHaveBeenCalledWith('storyId', 'userId');
    });

    it('should return undefined', () => {
      expect(result).toBe(undefined);
    });
  });

  describe('when updating a story', () => {
    beforeEach(async () => {
      (service.update as jest.Mock).mockResolvedValue('updatedStory');
      result = await controller.update(
        { title: 'test' } as IStory,
        'storyId',
        reqUserMock,
      );
    });

    it('should call the story service to update the story', () => {
      expect(service.update).toHaveBeenCalledWith({ title: 'test' }, 'userId', {
        _id: 'storyId',
      });
    });

    it('should return the updated story', () => {
      expect(result).toEqual({ story: 'updatedStory' });
    });
  });

  describe('when creating a new story', () => {
    beforeEach(async () => {
      (service.create as jest.Mock).mockResolvedValue('createdStory');
      result = await controller.create(
        { title: 'test' } as IStory,
        reqUserMock,
      );
    });

    it('should call the story service to create the story', () => {
      expect(service.create).toHaveBeenCalledWith({ title: 'test' }, 'userId');
    });

    it('should return the created story', () => {
      expect(result).toEqual({ story: 'createdStory' });
    });
  });
});
