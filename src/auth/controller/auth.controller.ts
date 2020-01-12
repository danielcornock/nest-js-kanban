import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../data/auth.dto';
import { AuthService } from '../service/auth.service';
import { IAuthPromise } from '../data/auth-res.interface';

@Controller('auth')
export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body() body: RegisterDTO): IAuthPromise {
    const user = await this._authService.register(body).catch(e => {
      throw e;
    });
    const jwt = this._authService.createJwt(user.name, user._id);

    return { jwt, user };
  }

  @Post('/login')
  public async login(@Body() body: LoginDTO): IAuthPromise {
    const user = await this._authService.login(body).catch(e => {
      throw e;
    });
    const jwt = this._authService.createJwt(user.name, user._id);

    return { jwt, user };
  }
}
