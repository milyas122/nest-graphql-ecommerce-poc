import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponseDto {
  @Field((type) => Int)
  status: number;

  @Field()
  message: string;
}
