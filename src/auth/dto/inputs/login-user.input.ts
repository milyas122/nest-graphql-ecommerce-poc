import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { authConstants } from 'src/lib/constants';

@InputType()
export class LoginUserInput {
  @Field()
  @IsNotEmpty({ message: authConstants.emailNotEmpty })
  @IsEmail({}, { message: authConstants.emailMustBeValid })
  email: string;

  @Field()
  @IsNotEmpty({ message: authConstants.passwordNotEmpty })
  @IsString({ message: authConstants.passwordMustBeString })
  password: string;
}
