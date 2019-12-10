import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public password: string;
}

export class LoginDTO {
  public readonly email: string;
  public readonly password: string;
}
