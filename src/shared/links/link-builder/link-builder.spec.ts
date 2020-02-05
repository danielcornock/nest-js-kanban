import { LinkBuilder } from './link-builder';

describe('LinkBuilder', () => {
  describe('when building the self link', () => {
    let result: string;

    describe('when there is an ID', () => {
      beforeEach(() => {
        result = LinkBuilder.self('area', 'id');
      });

      it('should return the concatenated string', () => {
        expect(result).toBe('area/id');
      });
    });

    describe('when there is not an id', () => {
      beforeEach(() => {
        result = LinkBuilder.self('area');
      });

      it('should return the string', () => {
        expect(result).toBe('area');
      });
    });
  });
});
