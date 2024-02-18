import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'email must not empty' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'name must not empty' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'password must not empty' })
  @IsString({ message: 'password must be a string' })
  password: string;
}
