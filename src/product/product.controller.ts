import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { IJwtPayload } from './interfaces';
import { AdminSellerGuard, JwtAuthGuard, SellerGuard } from 'src/guards';
import { SuccessResponse, sendSuccessResponse } from 'src/utils';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a product using the provided data
   *
   * @param {CreateProductDto} data - the data to create the product
   * @param {Request} req - the request object
   * @return {Promise<SuccessResponse>} the success response
   */
  @Post()
  @UseGuards(JwtAuthGuard, SellerGuard)
  async createProduct(
    @Body() data: CreateProductDto,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { user } = req;
    const userPayload = user as IJwtPayload;
    const result = await this.productService.createProduct(data, userPayload);
    return sendSuccessResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
    });
  }

  // pagination
  // should be public
  @Get()
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async getProducts(@Req() req: Request) {
    const { id: userId, role } = req.user as IJwtPayload;

    return this.productService.getProducts(userId, role);
  }

  /**
   * Retrieves product details by ID.
   *
   * @param {string} id - the ID of the product
   * @return {Promise<SuccessResponse>} a promise that resolves to a success response containing product details
   */
  @Get(':id')
  async getProductDetail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponse> {
    const product = await this.productService.getProductDetail(id);
    return sendSuccessResponse({
      statusCode: HttpStatus.OK,
      data: product,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async removeProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const { id: userId, role } = req.user as IJwtPayload;

    await this.productService.removeProduct({ productId: id, userId, role });

    return { message: 'product deleted successfully' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminSellerGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDto,
    @Req() req: Request,
  ) {
    const { id: userId, role } = req.user as IJwtPayload;

    return await this.productService.updateProduct(data, {
      productId: id,
      role,
      userId,
    });
  }
}
