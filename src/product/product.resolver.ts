import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { ProductService } from './product.service';
import {
  CreateProductPayload,
  GetProductDetailPayload,
  GetProductListPayload,
  JwtPayload,
} from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { UserRole } from 'src/auth/interfaces';
import { CreateProductInput } from './dto/inputs/create-product.input';
import { UpdateProductInput } from './dto/inputs';
import { Product } from './entities/product.entity';
import { CurrentUser } from 'src/common/decorators';
import { BaseResponseDto } from 'src/common/dto';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  /**
   * A resolver to retrieve the product list via pagination
   *
   * @param {number} page - the current page number
   * @return {Promise<GetProductListPayload>} return the list of products by its page number
   */
  @Query(() => GetProductListPayload, { name: 'getProducts', nullable: true })
  async getProducts(
    @Args('page', { type: () => Int }) page: number,
  ): Promise<GetProductListPayload> {
    const data = await this.productService.getProducts(page);
    return {
      status: HttpStatus.ACCEPTED,
      message: 'success',
      data,
    };
  }

  /**
   * Get the product detail by ID.
   *
   * @param {string} id - the ID of the product
   * @return {Promise<GetProductDetailPayload>} the product detail response payload
   */
  @Query(() => GetProductDetailPayload, { name: 'getProductDetail' })
  async getProductDetail(
    @Args('id') id: string,
  ): Promise<GetProductDetailPayload> {
    const data = await this.productService.getProductDetail(id);
    return {
      status: HttpStatus.ACCEPTED,
      message: 'success',
      data,
    };
  }

  /**
   * A resolver to remove a specific product from the products list.
   *
   * @param {string} id - the ID of the product to be removed
   * @return {Promise<{ message: string }>} a message indicating the result of the removal
   */
  @Mutation(() => BaseResponseDto, { name: 'removeProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.SELLER])
  async removeProduct(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto> {
    const { role, id: userId } = user;
    const { message } = await this.productService.removeProduct({
      productId: id,
      userId,
      role,
    });
    return {
      status: HttpStatus.ACCEPTED,
      message,
    };
  }

  /**
   * A resolver that creates an new product
   *
   * @param {CreateProductInput} data - input data require to create a new product
   * @return {Promise<CreateProductPayload>} returns the newly created product
   */
  @Mutation(() => CreateProductPayload, { name: 'createProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.SELLER])
  async createProduct(
    @Args('createProductInput') data: CreateProductInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateProductPayload> {
    const result = await this.productService.createProduct(data, user);
    return {
      status: HttpStatus.CREATED,
      message: 'success',
      data: result,
    };
  }

  /**
   * A resolver that updates an existing product
   *
   * @param {string} id - the ID of the product
   * @param {UpdateProductInput} data - the data to update the product
   * @return {Promise<{ message: string }>} a promise with a success message
   */
  @Mutation(() => BaseResponseDto, { name: 'updateProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.SELLER, UserRole.ADMIN])
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') data: UpdateProductInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<BaseResponseDto> {
    const { role, id: userId } = user;
    const { message } = await this.productService.updateProduct(data, {
      productId: id,
      userId,
      role,
    });
    return {
      status: HttpStatus.ACCEPTED,
      message,
    };
  }
}
