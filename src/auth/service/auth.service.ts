import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../model/user';
import { Model } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { jwtSecret, jwtExpires } from '../../config/env/env';
import { RegisterDTO, LoginDTO } from '../data/auth.dto';
import { BaseService } from '../../shared/abstracts/service.abstract';
import { IParams } from 'src/config/interfaces/params.interface';

@Injectable()
export class AuthService extends BaseService<IUser> {
  constructor(@InjectModel('User') userModel: Model<IUser>) {
    super(userModel);
  }

  public async register(body: RegisterDTO): Promise<IUser> {
    try {
      body.password = await hash(body.password, 12);
      const user: IUser = this._create(body);
      const savedUser: IUser = await this._save(user);

      return savedUser;
    } catch (e) {
      throw e;
    }
  }

  public async login(body: LoginDTO): Promise<IUser> {
    try {
      const user: IUser = await this._fetchUser(body.email);
      await this._checkPasswordMatch(body.password, user.password);

      return user;
    } catch (e) {
      throw e;
    }
  }

  public async fetchUser(query: IParams): Promise<IUser> {
    return await this._findOne(query);
  }

  private async _fetchUser(email: string): Promise<IUser> {
    try {
      const user: IUser = await this._findOne({ email }).select('+password');

      if (!user)
        throw new NotFoundException('No user found with that email address.');

      return user;
    } catch (e) {
      throw e;
    }
  }

  private async _checkPasswordMatch(
    loginPassword,
    storedPassword,
  ): Promise<void> {
    try {
      const isMatch: boolean = await compare(loginPassword, storedPassword);

      if (!isMatch) {
        throw new UnauthorizedException("Oops! That's the wrong password");
      }
    } catch (e) {
      throw e;
    }
  }

  public createJwt(name: string, id: string): string {
    return sign({ id, name }, jwtSecret, { expiresIn: jwtExpires });
  }
}
