import { Injectable, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { IUser } from '../model/user';
import { Model } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { jwtSecret, jwtExpires } from '../../config/env/env';
import { RegisterDTO, LoginDTO } from '../data/auth.dto';
import { BaseService } from '../../shared/abstracts/base-service.abstract';
import { IParams } from 'src/config/interfaces/params.interface';
import { MongooseModel } from 'src/shared/database/mongoose/constants';

@Injectable()
export class AuthService extends BaseService<IUser> {
  constructor(@Inject(MongooseModel.USER) userModel: Model<IUser>) {
    super(userModel);
  }

  public async register(body: RegisterDTO): Promise<IUser> {
    body.password = await hash(body.password, 12);
    const user: IUser = this._create<RegisterDTO>(body);
    const savedUser: IUser = await this._save(user);

    return savedUser;
  }

  public async login(body: LoginDTO): Promise<IUser> {
    const user: IUser = await this._fetchUser(body.email);
    await this._checkPasswordMatch(body.password, user.password);

    return user;
  }

  public async fetchUser(query: IParams): Promise<IUser> {
    return await this._findOne(query);
  }

  private async _fetchUser(email: string): Promise<IUser> {
    const user: IUser = await this._findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException('No user found with that email address.');
    }

    return user;
  }

  private async _checkPasswordMatch(loginPassword, storedPassword): Promise<void> {
    const isMatch: boolean = await compare(loginPassword, storedPassword);

    if (!isMatch) {
      throw new UnauthorizedException("Oops! That's the wrong password");
    }
  }

  public createJwt(name: string, id: string): string {
    return sign({ id, name }, jwtSecret, { expiresIn: jwtExpires });
  }
}
