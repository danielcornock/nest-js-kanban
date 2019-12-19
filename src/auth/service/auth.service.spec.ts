import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from '../model/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserModelMock } from '../model/user.model.mock';
import { RepoFactory } from '../../shared/database/repo.factory';
import { jwtSecret, jwtExpires } from '../../config/env/env';

describe('AuthService', () => {
  let service: AuthService, repo: RepoFactory<IUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: UserModelMock,
        },
      ],
    }).compile();

    repo = RepoFactory.create(UserModelMock);
    jest.spyOn(RepoFactory, 'create').mockReturnValue(repo);

    service = module.get<AuthService>(AuthService);
  });

  describe('when a user is registering', () => {
    let mockUserReq: IUser, returnValue: IUser, hashSpy, saveSpy;

    beforeEach(async () => {
      hashSpy = jest.spyOn(bcrypt, 'hash');
      saveSpy = jest.spyOn(repo, 'save');

      mockUserReq = {
        name: 'Tester',
        email: 'tester@mail.com',
        password: 'password',
      } as IUser;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the hash is successfully created', () => {
      beforeEach(() => {
        hashSpy.mockResolvedValue('####' as never);
      });

      describe('when the user has been saved', () => {
        beforeEach(async () => {
          saveSpy.mockReturnValue('savedUser');
          returnValue = await service.register(mockUserReq);
        });

        it('should hash the password', () => {
          expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
        });

        it('should save the user to the database', () => {
          expect(repo.save).toHaveBeenCalledWith({ data: mockUserReq });
        });

        it('should return the created usser', () => {
          expect(returnValue).toBe('savedUser');
        });

        describe('when the user has been saved', () => {
          beforeEach(async () => {});
        });
      });
    });
  });

  describe('when a user is logging in', () => {
    let mockUserRes: IUser,
      mockUserReq: IUser,
      returnValue: IUser,
      findOneSpy,
      bcryptCompareSpy;

    beforeEach(async () => {
      mockUserReq = {
        email: 'tester@mail.com',
        password: 'password',
      } as IUser;

      mockUserRes = {
        name: 'Tester',
        email: 'tester@mail.com',
        _id: '0000',
        password: '####',
      } as IUser;

      findOneSpy = jest.spyOn(repo, 'findOne');
      bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when a matching user is found', () => {
      let foundUser: UserModelMock;
      beforeEach(async () => {
        foundUser = new UserModelMock();
        findOneSpy.mockReturnValue(foundUser);
        jest
          .spyOn(foundUser, 'select')
          .mockReturnValue({ password: '####' } as IUser);
      });

      describe('when the password is a match', () => {
        beforeEach(async () => {
          bcryptCompareSpy.mockResolvedValue(true as never);
          returnValue = await service.login(mockUserReq);
        });

        it('should search for a matching user', () => {
          expect(repo.findOne).toHaveBeenCalledWith({
            email: mockUserReq.email,
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
      jest
        .spyOn(jwt, 'sign')
        .mockReturnValue(('jsonwebtoken' as unknown) as void);

      returnValue = service.createJwt('testName', '001');
    });

    it('should sign the token', () => {
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '001', name: 'testName' },
        jwtSecret,
        { expiresIn: jwtExpires },
      );
    });

    it('should return the signed token', () => {
      expect(returnValue).toBe('jsonwebtoken');
    });
  });

  describe('when fetching a user', () => {
    let returnValue: IUser;

    beforeEach(async () => {
      jest.spyOn(repo, 'findOne').mockReturnValue({ name: 'test' });
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
