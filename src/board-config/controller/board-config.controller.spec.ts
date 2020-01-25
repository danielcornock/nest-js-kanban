import { Test, TestingModule } from '@nestjs/testing';
import { BoardConfigController } from './board-config.controller';
import { BoardConfigServiceStub } from '../services/board-config.service.stub';
import { BoardConfigService } from '../services/board-config.service';
import { AuthModule } from '../../auth/auth.module';
import { IBoardConfig } from '../model/board-config';
import { reqUserMock } from '../../testing/req-user.mock';

describe('boardConfig Controller', () => {
  let controller: BoardConfigController,
    dependencies: {
      boardConfigService: BoardConfigServiceStub;
    };

  beforeEach(async () => {
    dependencies = {
      boardConfigService: new BoardConfigServiceStub()
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [BoardConfigController],
      providers: [{ provide: BoardConfigService, useValue: dependencies.boardConfigService }]
    }).compile();

    controller = module.get<BoardConfigController>(BoardConfigController);
  });

  describe('when updating the config', () => {
    let result: any;

    describe('when the board config is updated successfully', () => {
      beforeEach(() => {
        (dependencies.boardConfigService.update as jest.Mock).mockResolvedValue('boardConfig');

        result = controller.update({ tags: [] } as IBoardConfig, 'board-config-id', reqUserMock);
      });

      it('should update the config', () => {
        expect(dependencies.boardConfigService.update).toHaveBeenCalledWith({ tags: [] }, 'userId', { _id: 'board-config-id' });
      });

      it('should return the result', async () => {
        expect(await result).toEqual({ config: 'boardConfig' });
      });
    });

    describe('when something goes wrong when updating the config', () => {
      beforeEach(() => {
        (dependencies.boardConfigService.update as jest.Mock).mockRejectedValue('err');

        controller.update({ tags: [] } as IBoardConfig, 'board-config-id', reqUserMock).catch(e => (result = e));
      });

      it('should throw an error', async () => {
        expect(result).toBe('err');
      });
    });
  });
});
