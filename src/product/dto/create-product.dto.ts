import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'description is required' })
  @IsString({ message: 'description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Min(10, { message: 'price must be at least 10' })
  price: number;

  @IsNotEmpty({ message: 'stock is required' })
  @IsNumber()
  @Min(1, { message: 'stock must be at least 1' })
  stock: number;
}
