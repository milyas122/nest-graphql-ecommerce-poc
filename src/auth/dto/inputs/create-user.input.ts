import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { authConstants } from 'src/lib/constants';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: '' })
  @IsEmail({}, { message: authConstants.emailMustBeValid })
  email: string;

  @Field()
  @IsNotEmpty({ message: authConstants.nameNotEmpty })
  @IsString({ message: authConstants.nameMustBeString })
  name: string;

  @Field()
  @IsNotEmpty({ message: authConstants.passwordNotEmpty })
  @IsString({ message: authConstants.passwordMustBeString })
  password: string;
}
