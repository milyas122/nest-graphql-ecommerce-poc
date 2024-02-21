import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { productConstants } from 'src/constants/verbose';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: productConstants.titleMustBeString })
  title: string;

  @IsOptional()
  @IsString({ message: productConstants.descriptionMustBeString })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(10, { message: productConstants.priceMustBeAtLeast })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: productConstants.stockMustBeAtLeast })
  stock: number;
}
