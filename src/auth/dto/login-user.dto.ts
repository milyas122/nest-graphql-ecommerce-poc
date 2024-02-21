import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { authConstants } from 'src/constants/verbose';

export class LoginDto {
  @IsNotEmpty({ message: authConstants.emailNotEmpty })
  @IsEmail({}, { message: authConstants.emailMustBeValid })
  email: string;

  @IsNotEmpty({ message: authConstants.passwordNotEmpty })
  @IsString({ message: authConstants.passwordMustBeString })
  password: string;
}
