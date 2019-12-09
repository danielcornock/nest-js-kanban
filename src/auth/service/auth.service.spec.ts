import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { IUser } from '../user';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { UserModelMock } from '../model/user.model.mock';

describe('AuthService', () => {
  let service: AuthService;

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

      returnValue = await service.register(mockUserReq);
    });

    it('should hash the password', () => {
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
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

      jest.spyOn(UserModelMock, 'findOne');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      returnValue = await service.login(mockUserReq);
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
