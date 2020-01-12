import { CrudService } from './crud-service.abstract';
import { Document, Model } from 'mongoose';
import { MongooseModelMock } from '../../../testing/mongoose-model.mock';
import { RepoFactory } from '../../database/factory/repo.factory';
import * as exceptions from '@nestjs/common';
import { RepoFactoryStub } from '../../../shared/database/factory/repo.factory.stub';
import { MongooseQueryMock } from '../../../testing/mongoose-query.mock';

const model = new MongooseModelMock();

describe('CrudService', () => {
  let service: TestCrudService, model: Model<Document>, repo: RepoFactory<Document>, result: any;

  beforeEach(() => {
    model = (new MongooseModelMock() as Partial<Model<Document>>) as Model<Document>;

    repo = (new RepoFactoryStub() as Partial<RepoFactory<Document>>) as RepoFactory<Document>;

    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = new TestCrudService(model);

    jest.spyOn(exceptions, 'NotFoundException' as any);
  });

  describe('when fetching one document from the database', () => {
    describe('when a document is found', () => {
      beforeEach(async () => {
        (repo.findOne as jest.Mock).mockResolvedValue({
          _id: 'returnId'
        });

        result = await service.findOne({ _id: 'docId' }, 'userId');
      });

      it('should process the data and request the document', () => {
        expect(repo.findOne).toHaveBeenCalledWith({
          _id: 'docId',
          user: 'userId'
        });
      });

      it('should return the requested document', () => {
        expect(result).toEqual({ _id: 'returnId' });
      });
    });

    describe('when a document is not found', () => {
      beforeEach(async () => {
        (repo.findOne as jest.Mock).mockResolvedValue(undefined);
        service.findOne({ _id: 'docId' }, 'userId').catch(err => {
          result = err;
        });
      });

      it('should throw a not found exception', () => {
        expect(exceptions.NotFoundException).toHaveBeenCalled();
      });
    });
  });

  describe('when fetching multiple documents from the database', () => {
    beforeEach(async () => {
      (repo.findMany as jest.Mock).mockResolvedValue([{ _id: 'returnId' }]);
      result = await service.findMany('userId');
    });

    it('should request the documents with the supplied parameters', () => {
      expect(repo.findMany).toHaveBeenCalledWith({ user: 'userId' });
    });

    it('should return the requested documents', () => {
      expect(result).toEqual([{ _id: 'returnId' }]);
    });
  });

  describe('when fetching a list of items from the database', () => {
    let mongooseQueryMock: MongooseQueryMock;

    beforeEach(() => {
      mongooseQueryMock = new MongooseQueryMock();
      (repo.findMany as jest.Mock).mockReturnValue(mongooseQueryMock);
    });

    describe('when the documents are found', () => {
      beforeEach(() => {
        (mongooseQueryMock.select as jest.Mock).mockResolvedValue(['document-list']);
        result = service.list('user-id');
      });

      it('should request the documents from the repo', () => {
        expect(repo.findMany).toHaveBeenCalledWith({ user: 'user-id' });
      });

      it('should only select the title', () => {
        expect(mongooseQueryMock.select).toHaveBeenCalledWith('title');
      });

      it('should return the found documents', async () => {
        expect(await result).toEqual(['document-list']);
      });
    });
  });

  describe('when updating a document in the database', () => {
    describe('when a document is not found', () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        (repo.findOne as jest.Mock).mockResolvedValue(undefined);
        service
          .update(({ name: 'newDocName' } as unknown) as Document, 'userId', {
            _id: 'docId'
          })
          .catch(err => {
            result = err;
          });
      });

      it('should throw a not found exception', () => {
        expect(exceptions.NotFoundException).toHaveBeenCalled();
      });
    });

    describe('when a document is found', () => {
      beforeEach(async () => {
        (repo.findOne as jest.Mock).mockResolvedValue({
          name: 'oldDocName'
        });
        (repo.save as jest.Mock).mockResolvedValue({
          name: 'newDocName',
          user: 'userId'
        });

        result = await service.update(({ name: 'newDocName' } as unknown) as Document, 'userId', { _id: 'docId' });
      });

      it('should request the document from the database', () => {
        expect(repo.findOne).toHaveBeenCalledWith({
          _id: 'docId',
          user: 'userId'
        });
      });

      it('should save the updated document', () => {
        expect(repo.save).toHaveBeenCalledWith({ name: 'newDocName' });
      });

      it('should return the updated document', () => {
        expect(result).toEqual({ name: 'newDocName', user: 'userId' });
      });
    });
  });

  describe('when deleting a document from the database', () => {
    describe('when a document is deleted', () => {
      beforeEach(async () => {
        (repo.delete as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        result = await service.delete({ _id: 'docId' }, 'userId');
      });

      it('should request to delete the document', () => {
        expect(repo.delete).toHaveBeenCalledWith({
          _id: 'docId',
          user: 'userId'
        });
      });

      it('should not return anything', () => {
        expect(result).toBe(undefined);
      });
    });

    describe('when a document is not deleted', () => {
      let fn;
      beforeEach(async () => {
        (repo.delete as jest.Mock).mockResolvedValue({ deletedCount: 0 });
        service.delete({ _id: 'userId' }, 'userId').catch(err => {
          result = err;
        });
      });

      it('should throw a not found exception', async () => {
        expect(exceptions.NotFoundException).toHaveBeenCalled();
      });
    });
  });

  describe('when creating a new document in the database', () => {
    beforeEach(async () => {
      (repo.createEntity as jest.Mock).mockReturnValue({
        _id: 'docId',
        user: 'userId'
      });
      (repo.save as jest.Mock).mockResolvedValue({
        _id: 'docId',
        user: 'userId'
      });

      result = await service.create({ _id: 'docId' }, 'userId');
    });

    it('should create a new entity for the document', () => {
      expect(repo.createEntity).toHaveBeenCalledWith(model, {
        _id: 'docId',
        user: 'userId'
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
