import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, RegisterDTO, LoginDTO } from '../user';
import { Model } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { jwtSecret, jwtExpires } from '../../config/env';

@Injectable()
export class AuthService {
  private readonly _model: Model<IUser>;

  constructor(@InjectModel('User') userModel: Model<IUser>) {
    this._model = userModel;
  }

  public async register(body: RegisterDTO): Promise<IUser> {
    body.password = await hash(body.password, 12);
    const user: IUser = new this._model(body);
    const savedUser: IUser = await user.save();

    return savedUser;
  }

  public async login(body: LoginDTO): Promise<IUser> {
    const user: IUser = await this._fetchUser(body.email);
    await this._checkPasswordMatch(body.password, user.password);

    return user;
  }

  private async _fetchUser(email: string): Promise<IUser> {
    const user: IUser = await this._model
      .findOne({ email })
      .select('+password');

    if (!user) {
      throw new NotFoundException('User with that email does not exist.');
    }

    return user;
  }

  private async _checkPasswordMatch(
    loginPassword,
    storedPassword,
  ): Promise<void> {
    const match: boolean = await compare(loginPassword, storedPassword);

    if (!match) {
      throw new UnauthorizedException(
        'The password you have provided is incorrect.',
      );
    }
  }

  public createJwt(name: string, id: string) {
    return sign({ id, name }, jwtSecret, { expiresIn: jwtExpires });
  }
}
