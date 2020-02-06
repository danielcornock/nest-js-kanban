import { Document } from 'mongoose';
import { IDocumentNames } from 'src/config/interfaces/document-names.interface';
import { IModelData, IModelMeta } from 'src/config/interfaces/http/model-response.interface';
import { LinkBuilder } from '../links/link-builder/link-builder';

export class ModelInstance<T extends Document> {
  public data: IModelData<T> = {};
  public meta: IModelMeta;

  static create<D extends Document>(
    dataObject: D,
    names: IDocumentNames,
    selfLinkOverride?: string
  ) {
    return new ModelInstance<D>(dataObject, names, selfLinkOverride);
  }

  constructor(dataObject: T, names: IDocumentNames, selfLinkOverride) {
    this.data[names.singular] = dataObject;
    this.meta = {
      links: {
        self: selfLinkOverride ? selfLinkOverride : LinkBuilder.self(names.plural, dataObject._id)
      }
    };
  }
}
