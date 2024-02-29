import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

import { productConstants } from 'src/lib/constants';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty({ message: productConstants.titleNotEmpty })
  @IsString({ message: productConstants.titleMustBeString })
  title: string;

  @Field()
  @IsNotEmpty({ message: productConstants.descriptionNotEmpty })
  @IsString({ message: productConstants.descriptionMustBeString })
  description: string;

  @Field((type) => Int)
  @IsNotEmpty({ message: productConstants.priceNotEmpty })
  @IsNumber()
  @Min(10, { message: productConstants.priceMustBeAtLeast })
  price: number;

  @Field((type) => Int)
  @IsNotEmpty({ message: productConstants.stockNotEmpty })
  @IsNumber()
  @Min(1, { message: productConstants.stockMustBeAtLeast })
  stock: number;
}
