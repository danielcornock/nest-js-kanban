import { RepoFactory } from './repo.factory';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { IUser } from 'src/auth/model/user';
import { Model } from 'mongoose';

describe('RepoFactory', () => {
  let factory: RepoFactory<IUser>, model: Model<IUser>, result: string;

  beforeEach(() => {
    model = (new MongooseModelMock() as unknown) as Model<IUser>;
    factory = new RepoFactory(model);
  });

  describe('when finding one item from the database', () => {
    beforeEach(() => {
      jest.spyOn(model, 'findOne').mockReturnValue('data' as never);
      result = factory.findOne({ _id: '0000' });
    });

    it('should call the findone function on the model', () => {
      expect(model.findOne).toHaveBeenCalledWith({ _id: '0000' });
    });

    it('should return what the same function on the model returns', () => {
      expect(result).toBe('data');
    });
  });

  describe('when saving an item to the database', () => {
    let modelToSave: MongooseModelMock, result: string;

    beforeEach(() => {
      modelToSave = new MongooseModelMock();
      jest.spyOn(modelToSave, 'save').mockReturnValue('saved');
      result = factory.save(modelToSave);
    });

    it('should call the save function on the model', () => {
      expect(modelToSave.save).toHaveBeenCalledWith();
    });

    it('should return the value that the model returns', () => {
      expect(result).toBe('saved');
    });
  });
});
