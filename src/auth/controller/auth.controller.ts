import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDTO, LoginDTO } from '../user';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  public async register(@Body() body: RegisterDTO) {
    try {
      const user = await this._authService.register(body);
      const jwt = this._authService.createJwt(user.name, user._id);

      return { jwt, user };
    } catch {}
  }

  @Post('/login')
  public async login(@Body() body: LoginDTO) {
    try {
      const user = await this._authService.login(body);
      const jwt = this._authService.createJwt(user.name, user._id);

      return { jwt, user };
    } catch {}
  }
}
