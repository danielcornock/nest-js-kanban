import { RepoFactory } from './repo.factory';
import { MongooseModelMock } from '../../../testing/mongoose-model.mock';
import { Model, Document, Mongoose } from 'mongoose';

describe('RepoFactory', () => {
  let factory: RepoFactory<Document>, model: Model<Document>, result: string;

  beforeEach(() => {
    model = (new MongooseModelMock() as unknown) as Model<Document>;
    factory = new RepoFactory(model);
  });

  describe('when finding one item from the database', () => {
    beforeEach(() => {
      (model.findOne as jest.Mock).mockReturnValue('findOne' as any);
      result = factory.findOne({ _id: '0000' }) as any;
    });

    it('should call the findone method on the model', () => {
      expect(model.findOne).toHaveBeenCalledWith({ _id: '0000' });
    });

    it('should return the result', () => {
      expect(result).toBe('findOne');
    });
  });

  describe('when creating a database entity', () => {
    let modelToCreate: any;

    beforeEach(() => {
      result = factory.createEntity(
        (MongooseModelMock as unknown) as Model<Document>,
        {} as Document,
      ) as any;
    });

    it('should create a new entity', () => {
      expect(result).toBeInstanceOf(MongooseModelMock);
    });
  });

  describe('when finding multiple items in the database', () => {
    beforeEach(() => {
      (model.find as jest.Mock).mockReturnValue('findMany' as any);
      result = factory.findMany({ user: 'userId' }) as any;
    });

    it('should call the find method on the model', () => {
      expect(model.find).toHaveBeenCalledWith({ user: 'userId' });
    });

    it('should return the result', () => {
      expect(result).toBe('findMany');
    });
  });

  describe('when saving an item to the database', () => {
    let modelToSave: MongooseModelMock, result: string;

    beforeEach(() => {
      modelToSave = new MongooseModelMock();
      (modelToSave.save as jest.Mock).mockReturnValue('saved');
      result = factory.save(modelToSave as any) as any;
    });

    it('should call the save method on the model', () => {
      expect(modelToSave.save).toHaveBeenCalledWith();
    });

    it('should return the result', () => {
      expect(result).toBe('saved');
    });
  });

  describe('when deleting an item from the database', () => {
    beforeEach(() => {
      (model.deleteOne as jest.Mock).mockReturnValue('deleted');
      result = factory.delete({ _id: 'docId' }) as any;
    });

    it('should call the deleteOne method on the model', () => {
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: 'docId' });
    });

    it('should return the result', () => {
      expect(result).toBe('deleted');
    });
  });
});
