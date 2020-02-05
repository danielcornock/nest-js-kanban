import { Controller, UseGuards, Put, Param, Req, Body } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BaseController } from '../../shared/abstracts/base-controller.abstract.ts/base-controller.abstract';
import { IBoardConfig } from '../model/board-config';
import { BoardConfigService } from '../services/board-config.service';
import { IReq } from '../../config/interfaces/middleware-params.interface';
import { IModelPromiseDeprecated } from '../../config/interfaces/http/model-response-deprecated.interface';

@Controller()
@UseGuards(AuthGuard)
export class BoardConfigController extends BaseController<IBoardConfig, BoardConfigService> {
  constructor(BoardConfigService: BoardConfigService) {
    super(BoardConfigService, { plural: 'boardConfig', singular: 'boardConfig' });
  }

  @Put(`/:${this._nativeId}`)
  public async update(@Body() body: IBoardConfig, @Param(`${this._nativeId}`) _id: string, @Req() req: IReq): IModelPromiseDeprecated<IBoardConfig> {
    const config = await this._nativeService.update(body, req.user._id, { _id }).catch(e => {
      throw e;
    });

    return { config };
  }
}
