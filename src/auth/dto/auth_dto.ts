import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString({ message: 'Must' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @MinLength(6, { message: 'Must be at least 6 characters' })
  @IsString({ message: 'Must' })
  password: string;
}
