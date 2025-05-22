import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
