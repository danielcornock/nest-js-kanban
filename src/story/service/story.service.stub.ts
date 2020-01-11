import { CrudServiceStub } from '../../shared/abstracts/crud-service/crud-service.stub';

export class StoryServiceStub extends CrudServiceStub {
  public createStory = jest.fn();
}
