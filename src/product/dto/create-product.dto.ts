import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { productConstants } from 'src/constants/verbose';
export class CreateProductDto {
  @IsNotEmpty({ message: productConstants.titleNotEmpty })
  @IsString({ message: productConstants.titleMustBeString })
  title: string;

  @IsNotEmpty({ message: productConstants.descriptionNotEmpty })
  @IsString({ message: productConstants.descriptionMustBeString })
  description: string;

  @IsNotEmpty({ message: productConstants.priceNotEmpty })
  @IsNumber()
  @Min(10, { message: productConstants.priceMustBeAtLeast })
  price: number;

  @IsNotEmpty({ message: productConstants.stockNotEmpty })
  @IsNumber()
  @Min(1, { message: productConstants.stockMustBeAtLeast })
  stock: number;
}
