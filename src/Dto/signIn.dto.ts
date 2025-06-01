import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1235!' })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
