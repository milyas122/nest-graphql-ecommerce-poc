import { Field, Int, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { UserRoleString } from 'src/auth/interfaces';

@ObjectType()
export class MessagePayload {
  @Field()
  message: string;
}

@ObjectType()
export class JwtPayload {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: UserRoleString;
}

@ObjectType()
export class GetProductListPayload {
  @Field((type) => Int)
  current_page: number;

  @Field((type) => Int)
  total_pages: number;

  @Field((type) => Int)
  total: number;

  @Field((type) => [Product])
  products: Product[];
}

@ObjectType()
export class GetProductDetailPayload extends PickType(Product, [
  'id',
  'title',
  'description',
  'price',
  'stock',
]) {
  @Field((type) => JwtPayload)
  seller: JwtPayload;
}

@ObjectType()
export class CreateProductPayload extends OmitType(Product, [
  'seller',
  'productOrders',
]) {}
