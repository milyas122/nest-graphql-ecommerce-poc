import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { IJwtPayload } from './interfaces';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SuccessResponse, sendSuccessResponse } from 'src/utils';
import { Roles } from 'src/roles.decorator';
import { UserRole } from 'src/auth/interfaces';

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
  @Roles(UserRole.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  /**
   * Get a list of products
   *
   * @param {number} page - the page number
   * @return {Promise<SuccessResponse>} the success response
   */
  @Get()
  async getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ): Promise<SuccessResponse> {
    const products = await this.productService.getProducts(page);
    return sendSuccessResponse({
      statusCode: HttpStatus.OK,
      data: products,
    });
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

  /**
   * Remove a specific product.
   *
   * @param {string} id - the ID (string uuid) of the product to be removed
   * @param {Request} req - the request object
   * @return {Promise<SuccessResponse>} an object with a message, statusCode, and data
   */
  @Delete(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId, role } = req.user as IJwtPayload;
    const { message } = await this.productService.removeProduct({
      productId: id,
      userId,
      role,
    });
    return { message, statusCode: HttpStatus.OK, data: [] };
  }

  /**
   * Update a product with the given ID.
   *
   * @param {string} id - The ID (uuid) of the product to be updated
   * @param {UpdateProductDto} data - The data to update the product with
   * @param {Request} req - The request object
   * @return {Promise<SuccessResponse>} A promise that resolves to a success response
   */
  @Patch(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDto,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId, role } = req.user as IJwtPayload;
    const { message } = await this.productService.updateProduct(data, {
      productId: id,
      role,
      userId,
    });
    return { message, statusCode: HttpStatus.OK, data: [] };
  }
}
