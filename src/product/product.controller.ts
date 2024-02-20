import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';
import { Request } from 'express';
import { IJwtPayload } from './interfaces';
import { AdminSellerGuard, JwtAuthGuard, SellerGuard } from 'src/guards';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, SellerGuard)
  async createProduct(@Body() data: CreateProductDto, @Req() req: Request) {
    const { user } = req;
    const userPayload = user as IJwtPayload;

    return this.productService.createProduct(data, userPayload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async getProducts(@Req() req: Request) {
    const { id: userId, role } = req.user as IJwtPayload;

    return this.productService.getProducts(userId, role);
  }
}
