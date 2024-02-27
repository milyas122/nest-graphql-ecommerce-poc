import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class CreateUserPayload {
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
export class LoginUserPayload {
  @Field((type) => CreateUserPayload)
  user: CreateUserPayload;

  @Field()
  access_token: string;
}

@ObjectType()
export class RegisterUserPayload extends LoginUserPayload {}
