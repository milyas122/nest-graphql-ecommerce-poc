import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { orderConstants } from 'src/constants/verbose';

class ProductOrderItemDto {
  @IsNotEmpty({ message: orderConstants.productIdNotEmpty })
  productId: string;

  @IsNotEmpty({ message: orderConstants.quantityNotEmpty })
  @IsPositive({ message: orderConstants.quantityMustBeAtLeastOne })
  quantity: number = 1;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: orderConstants.productArrayNotEmpty })
  @IsArray({ message: orderConstants.productsMustBeArray })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products: ProductOrderItemDto[];
}
