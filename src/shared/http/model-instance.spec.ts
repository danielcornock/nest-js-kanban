import { ModelInstance } from './model-instance';
import { IDocumentNames } from 'src/config/interfaces/document-names.interface';
import { LinkBuilder } from '../links/link-builder/link-builder';

describe('ModelInstance', () => {
  let model: ModelInstance<any>, data: any, names: IDocumentNames;

  beforeEach(() => {
    names = { singular: 'singular', plural: 'plural' };
    data = { _id: '_id' };
    jest.spyOn(LinkBuilder, 'self').mockReturnValue('link/self');
    model = ModelInstance.create(data, names);
  });

  it('should create a model instance', () => {
    expect(model).toEqual({
      data: {
        singular: { _id: '_id' }
      },
      meta: {
        links: {
          self: 'link/self'
        }
      }
    });
  });
});
