import { IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  correo: string;

  @IsString()
  password: string;
}