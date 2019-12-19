import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../data/auth.dto';
import { AuthService } from '../service/auth.service';
import { IAuthRes } from '../data/auth-res.interface';

@Controller('auth')
export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body() body: RegisterDTO): Promise<IAuthRes> {
    try {
      const user = await this._authService.register(body);
      const jwt = this._authService.createJwt(user.name, user._id);

      return { jwt, user };
    } catch (e) {
      throw e;
    }
  }

  @Post('/login')
  public async login(@Body() body: LoginDTO): Promise<IAuthRes> {
    try {
      const user = await this._authService.login(body);
      const jwt = this._authService.createJwt(user.name, user._id);

      return { jwt, user };
    } catch (e) {
      throw e;
    }
  }
}
