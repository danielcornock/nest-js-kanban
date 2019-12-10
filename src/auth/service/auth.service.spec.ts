import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { IUser } from '../model/user';
import * as bcrypt from 'bcryptjs';
import { UserModelMock } from '../model/user.model.mock';
import { RepoService } from '../../shared/database/repo.factory';

describe('AuthService', () => {
  let service: AuthService, repo: RepoService<IUser>;

  beforeEach(async () => {
    // function mockUserModel(dto: any) {
    //   this.data = dto;
    //   this.save = () => {
    //     return this.data;
    //   };
    //   this.findOne = () => {
    //     return this.data;
    //   };
    // }

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
      jest.spyOn(UserModelMock, 'findOne');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      returnValue = await service.login(mockUserReq);
    });

    it('should call the findone method in the repo service', () => {
      expect(repo.findOne).toHaveBeenCalledWith({ email: mockUserReq.email });
    });

    test.todo('should call the select method to add the password');

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
