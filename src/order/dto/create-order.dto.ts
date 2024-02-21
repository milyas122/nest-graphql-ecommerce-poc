import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { orderConstants } from 'src/constants/verbose';

class ProductOrderItemDto {
  @IsNotEmpty({ message: orderConstants.productIdNotEmpty })
  productId: string;

  @IsNotEmpty({ message: orderConstants.quantityNotEmpty })
  quantity: number = 1;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: orderConstants.productArrayNotEmpty })
  @IsArray({ message: orderConstants.productsMustBeArray })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products: ProductOrderItemDto[];
}
