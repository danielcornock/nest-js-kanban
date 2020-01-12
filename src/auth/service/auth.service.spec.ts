import { AuthService } from './auth.service';
import { IUser } from '../model/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MongooseModelMock } from '../../testing/mongoose-model.mock';
import { RepoFactory } from '../../shared/database/factory/repo.factory';
import { jwtSecret, jwtExpires } from '../../config/env/env';
import { Model } from 'mongoose';
import { RepoFactoryStub } from '../../shared/database/factory/repo.factory.stub';
import * as exceptions from '@nestjs/common';
import { MongooseQueryMock } from '../../testing/mongoose-query.mock';

describe('AuthService', () => {
  let service: AuthService, repo: RepoFactory<IUser>, model: Model<IUser>;

  beforeEach(async () => {
    model = (new MongooseModelMock() as Partial<Model<IUser>>) as Model<IUser>;
    repo = (new RepoFactoryStub() as unknown) as RepoFactory<IUser>;

    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);
    jest.spyOn(exceptions, 'NotFoundException' as any);
    service = new AuthService(model);
  });

  describe('when a user is registering', () => {
    let mockUserReq: IUser, returnValue: IUser, hashSpy;

    beforeEach(async () => {
      hashSpy = jest.spyOn(bcrypt, 'hash');

      mockUserReq = {
        name: 'Tester',
        email: 'tester@mail.com',
        password: 'password'
      } as IUser;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when something goes wrong when creating the hash', () => {
      beforeEach(done => {
        hashSpy.mockRejectedValue('rejectedHash');
        service.register(mockUserReq).catch(e => {
          returnValue = e;
          done();
        });
      });

      it('should return the error', () => {
        expect(returnValue).toBe('rejectedHash');
      });
    });

    describe('when the hash is successfully created', () => {
      beforeEach(() => {
        hashSpy.mockResolvedValue('####' as never);
      });

      describe('when something goes wrong when saving the user', () => {
        beforeEach(done => {
          (repo.save as jest.Mock).mockRejectedValue('rejectedSave');
          service.register(mockUserReq).catch(e => {
            returnValue = e;
            done();
          });
        });

        it('should return the error', () => {
          expect(returnValue).toBe('rejectedSave');
        });
      });

      describe('when the user has been saved', () => {
        beforeEach(async () => {
          (repo.save as jest.Mock).mockReturnValue('savedUser');
          returnValue = await service.register(mockUserReq);
        });

        it('should hash the password', () => {
          expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
        });

        it('should save the user to the database', () => {
          expect(repo.save).toHaveBeenCalled();
        });

        it('should return the created usser', () => {
          expect(returnValue).toBe('savedUser');
        });
      });
    });
  });

  describe('when a user is logging in', () => {
    let mockUserReq: IUser, returnValue: IUser, bcryptCompareSpy;

    beforeEach(async () => {
      bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');

      mockUserReq = {
        email: 'tester@mail.com',
        password: 'password'
      } as IUser;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when no matching users are found', () => {
      beforeEach(done => {
        const foundModel = new MongooseQueryMock();
        (repo.findOne as jest.Mock).mockReturnValue(foundModel);
        jest.spyOn(foundModel, 'select').mockResolvedValue(undefined);
        service.login(mockUserReq).catch(() => done());
      });

      it('should throw a not found exception', () => {
        expect(exceptions.NotFoundException).toHaveBeenCalled();
      });
    });

    describe('when a matching user is found', () => {
      let foundUser: MongooseQueryMock;

      beforeEach(async () => {
        foundUser = new MongooseQueryMock();
        (repo.findOne as jest.Mock).mockReturnValue(foundUser);
        jest.spyOn(foundUser, 'select').mockReturnValue({ password: '####' } as IUser);
      });

      describe('when the password is not a match', () => {
        beforeEach(done => {
          jest.spyOn(exceptions, 'UnauthorizedException' as any);
          bcryptCompareSpy.mockResolvedValue(false);
          service.login(mockUserReq).catch(() => done());
        });

        it('should throw an unauthorised exception', () => {
          expect(exceptions.UnauthorizedException).toHaveBeenCalled();
        });
      });

      describe('when the password is a match', () => {
        beforeEach(async () => {
          bcryptCompareSpy.mockResolvedValue(true);
          returnValue = await service.login(mockUserReq);
        });

        it('should search for a matching user', () => {
          expect(repo.findOne).toHaveBeenCalledWith({
            email: mockUserReq.email
          });
        });

        it('should request the password from the database', () => {
          expect(foundUser.select).toHaveBeenCalledWith('+password');
        });

        it('should check if the password is a match', () => {
          expect(bcrypt.compare).toHaveBeenCalledWith('password', '####');
        });

        it('should return a user', () => {
          expect(returnValue).toEqual({ password: '####' });
        });
      });
    });
  });

  describe('when creating a json web token', () => {
    let returnValue: string;

    beforeEach(() => {
      jest.spyOn(jwt, 'sign').mockReturnValue('jsonwebtoken' as any);

      returnValue = service.createJwt('testName', '001');
    });

    it('should sign the token', () => {
      expect(jwt.sign).toHaveBeenCalledWith({ id: '001', name: 'testName' }, jwtSecret, { expiresIn: jwtExpires });
    });

    it('should return the signed token', () => {
      expect(returnValue).toBe('jsonwebtoken');
    });
  });

  describe('when fetching a user', () => {
    let returnValue: IUser;

    beforeEach(async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue({ name: 'test' } as IUser);
      returnValue = await service.fetchUser({ id: '000' });
    });

    it('should fetch the user from the repo', () => {
      expect(repo.findOne).toHaveBeenCalledWith({ id: '000' });
    });

    it('should return the user', () => {
      expect(returnValue).toEqual({ name: 'test' });
    });
  });
});
