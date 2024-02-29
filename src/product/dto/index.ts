import { Field, Int, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { UserRoleString } from 'src/auth/interfaces';
import { BaseResponseDto } from 'src/common/dto';

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
class GetProductList {
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
export class GetProductListPayload extends BaseResponseDto {
  @Field((type) => GetProductList)
  data: GetProductList;
}

@ObjectType()
class GetProduct extends PickType(Product, [
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
export class GetProductDetailPayload extends BaseResponseDto {
  @Field((type) => GetProduct)
  data: GetProduct;
}

@ObjectType()
class CreateProduct extends OmitType(GetProduct, ['seller']) {}

@ObjectType()
export class CreateProductPayload extends BaseResponseDto {
  @Field((type) => CreateProduct)
  data: CreateProduct;
}
