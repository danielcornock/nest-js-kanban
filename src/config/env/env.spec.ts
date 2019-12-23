import * as env from './env';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

describe('env', () => {
  let database: string;

  describe('when getting the database', () => {
    describe('when the environment is development', () => {
      beforeEach(() => {
        database = env.database('development');
      });

      it('should return the database string for development', () => {
        expect(database).toBe('mongodb://127.0.0.1:27017/kanban-nest');
      });
    });
  });

  describe('when getting the environment', () => {
    describe('when the node env is defined', () => {
      it('should set the environment variable to be the node env value', () => {
        expect(env.environment).toBe('test');
      });
    });
  });
});
