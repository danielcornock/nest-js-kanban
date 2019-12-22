import { CrudService } from './crud-service.abstract';
import { Document, Model } from 'mongoose';
import { MongooseModelMock } from '../../../testing/mongoose-model.mock';
import { RepoFactory } from '../../database/factory/repo.factory';
import { IUser } from 'src/auth/model/user';

const model = new MongooseModelMock();

describe('CrudService', () => {
  let service: TestCrudService,
    model: Model<Document>,
    repo: RepoFactory<Document>,
    result: any;

  beforeEach(() => {
    model = (new MongooseModelMock() as Partial<Model<Document>>) as Model<
      Document
    >;
    repo = RepoFactory.create<Document>(model);
    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);
    service = new TestCrudService(model);
  });

  describe('when fetching one document from the database', () => {
    beforeEach(async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(({
        _id: 'returnId',
      } as unknown) as Document);

      result = await service.findOne({ _id: 'docId' }, 'userId');
    });

    it('should process the data and request the document', () => {
      expect(repo.findOne).toHaveBeenCalledWith({
        _id: 'docId',
        user: 'userId',
      });
    });

    it('should return the requested document', () => {
      expect(result).toEqual({ _id: 'returnId' });
    });
  });

  describe('when fetching multiple documents from the database', () => {
    beforeEach(async () => {
      jest
        .spyOn(repo, 'findMany')
        .mockResolvedValue(([{ _id: 'returnId' }] as unknown) as Array<
          Document
        >);

      result = await service.findMany('userId');
    });

    it('should request the documents with the supplied parameters', () => {
      expect(repo.findMany).toHaveBeenCalledWith({ user: 'userId' });
    });

    it('should return the requested documents', () => {
      expect(result).toEqual(([{ _id: 'returnId' }] as unknown) as Array<
        Document
      >);
    });
  });

  describe('when updating a document in the database', () => {
    beforeEach(async () => {
      jest
        .spyOn(repo, 'findOne')
        .mockResolvedValue(({ name: 'oldDocName' } as unknown) as Document);
      jest.spyOn(repo, 'save').mockResolvedValue(({
        name: 'newDocName',
        user: 'userId',
      } as unknown) as Document);

      result = await service.update(
        ({ name: 'newDocName' } as unknown) as Document,
        'userId',
        { _id: 'docId' },
      );
    });

    it('should request the document from the database', () => {
      expect(repo.findOne).toHaveBeenCalledWith({
        _id: 'docId',
        user: 'userId',
      });
    });

    it('should save the updated document', () => {
      expect(repo.save).toHaveBeenCalledWith({ name: 'newDocName' });
    });

    it('should return the updated document', () => {
      expect(result).toEqual({ name: 'newDocName', user: 'userId' });
    });
  });

  describe('when deleting a document from the database', () => {
    beforeEach(async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ deletedCount: 1 });
      result = await service.delete('docId', 'userId');
    });

    it('should request to delete the document', () => {
      expect(repo.delete).toHaveBeenCalledWith({
        _id: 'docId',
        user: 'userId',
      });
    });

    it('should not throw an error', () => {
      expect(service.delete).not.toThrow();
    });

    it('should not return anything', () => {
      expect(result).toBe(undefined);
    });
  });

  describe('when creating a new document in the database', () => {
    beforeEach(async () => {
      jest.spyOn(repo, 'createEntity').mockReturnValue(({
        _id: 'docId',
        user: 'userId',
      } as unknown) as Document);
      jest
        .spyOn(repo, 'save')
        .mockResolvedValue(({
          _id: 'docId',
          user: 'userId',
        } as unknown) as Document);

      result = await service.create({ _id: 'docId' }, 'userId');
    });

    it('should create a new entity for the document', () => {
      expect(repo.createEntity).toHaveBeenCalledWith(model, {
        _id: 'docId',
        user: 'userId',
      });
    });

    it('should save the new document to the database', () => {
      expect(repo.save).toHaveBeenCalledWith({ _id: 'docId', user: 'userId' });
    });

    it('should return the saved user', () => {
      expect(result).toEqual({ _id: 'docId', user: 'userId' });
    });
  });
});

class TestCrudService extends CrudService<Document> {
  constructor(mongooseModel: Model<Document>) {
    super(mongooseModel);
  }
}
