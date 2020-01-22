import { Test, TestingModule } from '@nestjs/testing';
import { BoardConfigController } from './board-config.controller';
import { BoardConfigServiceStub } from '../services/board-config.service.stub';
import { BoardConfigService } from '../services/board-config.service';
import { AuthModule } from '../../auth/auth.module';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
