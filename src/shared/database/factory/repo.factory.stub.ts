import { IParams } from '../../../config/interfaces/params.interface';
import { Model, Document, DocumentQuery, Query } from 'mongoose';

export class RepoFactoryStub {
  public createEntity = jest.fn();

  public findMany = jest.fn();

  public findOne = jest.fn();

  public save = jest.fn();

  public delete = jest.fn();
}
