import { CrudService } from '../crud-service/crud-service.abstract';
import { Document } from 'mongoose';
import { IDocumentNames } from '../../../config/interfaces/document-names.interface';
import { Get, Req, Param, HttpCode, Delete } from '@nestjs/common';
import { IReq } from '../../../config/interfaces/middleware-params.interface';
import { ICollectionPromise } from 'src/config/interfaces/http/collection-response.interface';
import { IModelPromise } from 'src/config/interfaces/http/model-response.interface';

export class BaseController<D extends Document, S extends CrudService<D>> {
  protected readonly _nativeService: S;
  protected readonly _names: IDocumentNames;
  protected readonly _nativeId: string;

  constructor(service: S, names: IDocumentNames) {
    this._nativeService = service;
    this._nativeId = names.singular + 'Id';
    this._names = names;
  }

  @Get('/')
  public async findAll(@Req() req: IReq, @Param() param?: any): ICollectionPromise<D> {
    const docs = await this._nativeService.findMany(req.user._id).catch(e => {
      throw e;
    });

    return { [this._names.plural]: docs };
  }

  @Get('/list')
  public async list(@Req() req: IReq): ICollectionPromise<Partial<D>> {
    const documentList = await this._nativeService.list(req.user._id).catch(e => {
      throw e;
    });

    return { [this._names.plural]: documentList };
  }

  @Get(`/:${this._nativeId}`)
  public async findOne(@Param(`${this._nativeId}`) _id: string, @Req() req: IReq): IModelPromise<D> {
    const doc = await this._nativeService.findOne({ _id }, req.user._id).catch(e => {
      throw e;
    });

    return { [this._names.singular]: doc };
  }

  @Delete(`/:${this._nativeId}`)
  @HttpCode(204)
  public async delete(@Param(`${this._nativeId}`) _id: string, @Req() req: IReq): Promise<void> {
    await this._nativeService.delete({ _id }, req.user._id).catch(e => {
      throw e;
    });

    return;
  }
}
