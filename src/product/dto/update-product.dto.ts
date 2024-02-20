import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(10, { message: 'price must be at least 10' })
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'stock must be at least 1' })
  stock: number;
}
