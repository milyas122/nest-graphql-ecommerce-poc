import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseResponseDto } from 'src/common/dto';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
class CreateUser {
  // rename it to CreateUserDto
  @Field()
  sub: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field((type) => UserRole)
  role: UserRole;
}

@ObjectType()
export class CreateUserPayload extends BaseResponseDto {
  @Field((type) => CreateUser)
  data: CreateUser;
}

@ObjectType()
class LoginUser {
  @Field((type) => CreateUser)
  user: CreateUser;

  @Field()
  access_token: string;
}

@ObjectType()
export class LoginUserPayload extends BaseResponseDto {
  @Field((type) => LoginUser)
  data: LoginUser;
}

@ObjectType()
class RegisterUser extends LoginUser {}

@ObjectType()
export class RegisterUserPayload extends BaseResponseDto {
  @Field((type) => RegisterUser)
  data: RegisterUser;
}
