import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { orderConstants } from 'src/constants/verbose';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class ProductOrderItemInput {
  @Field()
  @IsNotEmpty({ message: orderConstants.productIdNotEmpty })
  productId: string;

  @Field((type) => Int, { defaultValue: 1 })
  @IsNotEmpty({ message: orderConstants.quantityNotEmpty })
  @IsPositive({ message: orderConstants.quantityMustBeAtLeastOne })
  quantity: number = 1;
}

@InputType()
export class CreateOrderInput {
  @Field((type) => [ProductOrderItemInput], { nullable: true })
  @IsNotEmpty({ message: orderConstants.productArrayNotEmpty })
  @IsArray({ message: orderConstants.productsMustBeArray })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemInput)
  products: ProductOrderItemInput[];
}
