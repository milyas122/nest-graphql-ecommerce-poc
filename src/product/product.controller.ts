import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async getProductDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const { id: sellerId } = req.user as IJwtPayload;
    return await this.productService.getProductDetail({ id, sellerId });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async removeProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const { id: userId, role } = req.user as IJwtPayload;

    await this.productService.removeProduct({ id, sellerId: userId, role });

    return { message: 'product deleted successfully' };
  }
}
