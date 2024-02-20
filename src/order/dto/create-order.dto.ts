import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductOrderItemDto {
  @IsNotEmpty({ message: 'productId is required' })
  productId: string;

  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number = 1;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'products array is required' })
  @IsArray({ message: 'products must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItemDto)
  products: ProductOrderItemDto[];
}
