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
import { jwtSecret, jwtExpires } from '../../config/env';
import { RegisterDTO, LoginDTO } from '../data/auth.dto';
import { RepoService } from '../../shared/database/repo.factory';
import { BaseService } from '../../shared/abstracts/service.abstract';

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
    } catch {}
  }

  public async login(body: LoginDTO): Promise<IUser> {
    try {
      const user: IUser = await this._fetchUser(body.email);
      await this._checkPasswordMatch(body.password, user.password);

      return user;
    } catch {}
  }

  private async _fetchUser(email: string): Promise<IUser> {
    try {
      const user: IUser = await this._findOne({ email }).select('+password');

      if (!user) {
        throw new NotFoundException('User with that email does not exist.');
      }

      return user;
    } catch {}
  }

  private async _checkPasswordMatch(
    loginPassword,
    storedPassword,
  ): Promise<void> {
    try {
      if (!(await compare(loginPassword, storedPassword))) {
        throw new UnauthorizedException(
          'The password you have provided is incorrect.',
        );
      }
    } catch {}
  }

  public createJwt(name: string, id: string) {
    return sign({ id, name }, jwtSecret, { expiresIn: jwtExpires });
  }
}
