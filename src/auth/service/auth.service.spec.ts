import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from '../model/user';
import * as bcrypt from 'bcryptjs';
import { UserModelMock } from '../model/user.model.mock';
import { RepoService } from '../../shared/database/repo.factory';
import { NotFoundException, NotAcceptableException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService, repo: RepoService<IUser>;

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

    repo = RepoService.create(UserModelMock);
    jest.spyOn(RepoService, 'create').mockReturnValue(repo);

    service = module.get<AuthService>(AuthService);
  });

  describe('when a user is registering', () => {
    let mockUserReq: IUser, returnValue: IUser;

    beforeEach(async () => {
      mockUserReq = {
        name: 'Tester',
        email: 'tester@mail.com',
        password: 'password',
      } as IUser;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('####' as never);
      jest.spyOn(repo, 'save');

      returnValue = await service.register(mockUserReq);
    });

    it('should hash the password', () => {
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
    });

    it('should call the create method on the repo', () => {
      expect(repo.save).toHaveBeenCalledWith({ data: mockUserReq });
    });

    it('should return a user with a hashed password', () => {
      expect(returnValue).toEqual({
        email: 'tester@mail.com',
        name: 'Tester',
        password: '####',
      });
    });
  });

  describe('when a user is logging in', () => {
    let mockUserRes: IUser, mockUserReq: IUser, returnValue: IUser;

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

      jest.spyOn(repo, 'findOne');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    });

    describe('when findOne rejects', () => {
      let rejectedFunction;
      beforeEach(async () => {
        rejectedFunction = jest
          .spyOn(UserModelMock, 'findOne')
          .mockRejectedValue('rejected' as never);

        returnValue = await service.login(mockUserReq);
      });

      it('should throw an error', () => {
        expect(rejectedFunction).toThrowError();
      });

      it('should not check if the password is a match', () => {
        expect(bcrypt.compare).not.toHaveBeenCalled();
      });
    });

    describe('when findOne resolves but does not find a user', () => {
      beforeEach(async () => {
        jest.spyOn(UserModelMock, 'findOne').mockReturnValue(undefined);
        returnValue = await service.login(mockUserReq);
      });

      it('should throw a not found exception', () => {
        expect(NotFoundException).toThrowError();
      });

      it('should not check for a password match', () => {
        expect(bcrypt.compare).not.toHaveBeenCalled();
      });

      it('should not return a user', () => {
        expect(returnValue).toBe(undefined);
      });
    });

    describe('when findOne resolves successfully', () => {
      let userReturn: UserModelMock;
      beforeEach(async () => {
        userReturn = new UserModelMock();
        jest.spyOn(userReturn, 'select');
        jest.spyOn(UserModelMock, 'findOne').mockReturnValue(userReturn);
        returnValue = await service.login(mockUserReq);
      });

      it('should call select on the returned value', () => {
        expect(userReturn.select).toHaveBeenCalled();
      });

      it('should call the findone method in the repo service', () => {
        expect(repo.findOne).toHaveBeenCalledWith({ email: mockUserReq.email });
      });

      it('should find the user', () => {
        expect(UserModelMock.findOne).toHaveBeenCalledWith({
          email: mockUserReq.email,
        });
      });

      it('should check if the password is a match', () => {
        expect(bcrypt.compare).toHaveBeenCalledWith('password', '####');
      });

      it('should return a user', () => {
        expect(returnValue).toEqual(mockUserRes);
      });
    });
  });
});
