import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IBoardConfig } from '../model/board-config';
import { BoardConfigService } from '../services/board-config.service';

@Controller('board-config')
@UseGuards(AuthGuard)
export class BoardConfigController extends BaseController<IBoardConfig, BoardConfigService> {
  constructor(BoardConfigService: BoardConfigService) {
    super(BoardConfigService, { plural: 'boardConfig', singular: 'boardConfig' });
  }
}
