import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from '../service/board.service';
import { BoardServiceStub } from '../service/board.service.stub';
import { AuthModule } from '../../auth/auth.module';
import { IBoard } from '../model/board';
import { reqUserMock } from '../../testing/req-user.mock';
import { ModelInstance } from '../../shared/http/model-instance';
import { ModelInstanceStub } from '../../shared/http/model-instance.stub';
import { boardDocumentNames } from '../providers/board.providers';
import { StubCreator } from '../../testing/stub-creator.service';

describe('Board Controller', () => {
  let controller: BoardController,
    service: BoardService,
    result: any,
    modelInstance: ModelInstanceStub;

  beforeEach(async () => {
    modelInstance = new ModelInstanceStub();

    jest.spyOn(ModelInstance, 'create').mockReturnValue(modelInstance);

    service = StubCreator.create(BoardServiceStub);
    controller = new BoardController(service);
  });

  describe('when updating a board', () => {
    describe('when a board is successfully updated', () => {
      beforeEach(async () => {
        (service.updateBoard as jest.Mock).mockResolvedValue('updatedBoard');
        result = await controller.update({ title: 'test' } as IBoard, 'boardId', reqUserMock);
      });

      it('should call the board service to update the board', () => {
        expect(service.updateBoard).toHaveBeenCalledWith({ title: 'test' }, 'userId', {
          _id: 'boardId'
        });
      });

      it('should create the model instance', () => {
        expect(ModelInstance.create).toHaveBeenCalledWith('updatedBoard', boardDocumentNames);
      });

      it('should return the updated board', () => {
        expect(result).toBe(modelInstance);
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.updateBoard as jest.Mock).mockRejectedValue('rejectedUpdate');
        controller
          .update({ title: 'test' } as IBoard, 'boardId', reqUserMock)
          .catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedUpdate');
      });
    });
  });

  describe('when creating a new board', () => {
    describe('when a board is successfully created', () => {
      beforeEach(async () => {
        (service.createBoard as jest.Mock).mockResolvedValue('createdStory');
        result = await controller.create({ title: 'test' } as IBoard, reqUserMock);
      });

      it('should call the board service to create the board', () => {
        expect(service.createBoard).toHaveBeenCalledWith({ title: 'test' }, 'userId');
      });

      it('should return the created story', () => {
        expect(result).toEqual({ board: 'createdStory' });
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.createBoard as jest.Mock).mockRejectedValue('rejectedCreate');
        controller.create({ title: 'test' } as IBoard, reqUserMock).catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedCreate');
      });
    });
  });
});
