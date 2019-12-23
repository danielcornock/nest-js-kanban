import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { jwtSecret } from '../../config/env/env';
import { IParams } from 'src/config/interfaces/params.interface';
import { AuthService } from '../service/auth.service';
import { promisify } from '../../config/utilties/utilities';
import { IUser } from '../model/user';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this._authenticate(request);
  }

  private async _authenticate(request: any): Promise<boolean> {
    const token = this._checkForJwt(request.headers.authorization);
    if (!token) return false;

    const jwtVerify = promisify(verify);

    let decoded: IParams;
    try {
      decoded = await jwtVerify(token, jwtSecret);
    } catch {
      return false;
    }

    return this._attachUser(decoded.id, request);
  }

  private _checkForJwt(auth: string): string {
    let token: string;

    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    }

    return token;
  }

  private async _attachUser(id: string, request: any): Promise<boolean> {
    let user: IUser;

    user = await this._authService.fetchUser({ _id: id }).catch(e => {
      throw e;
    });

    if (!user) {
      throw new NotFoundException('This user no longer exists!');
    }

    request.user = user;
    return true;
  }
}
