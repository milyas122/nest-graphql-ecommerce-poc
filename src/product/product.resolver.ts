import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { ProductService } from './product.service';
import {
  CreateProductPayload,
  GetProductDetailPayload,
  GetProductListPayload,
  JwtPayload,
  MessagePayload,
} from './dto';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserRole } from 'src/auth/interfaces';
import { CurrentUser } from 'src/current-user.decorator';
import { CreateProductInput } from './dto/inputs/create-product.input';
import { UpdateProductInput } from './dto/inputs';
import { Product } from './entities/product.entity';

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
    return await this.productService.getProducts(page);
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
    return await this.productService.getProductDetail(id);
  }

  /**
   * A resolver to remove a specific product from the products list.
   *
   * @param {string} id - the ID of the product to be removed
   * @return {Promise<{ message: string }>} a message indicating the result of the removal
   */
  @Mutation(() => MessagePayload, { name: 'removeProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.SELLER])
  async removeProduct(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    const { role, id: userId } = user;
    return await this.productService.removeProduct({
      productId: id,
      userId,
      role,
    });
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
    console.log(user);
    return await this.productService.createProduct(data, user);
  }

  /**
   * A resolver that updates an existing product
   *
   * @param {string} id - the ID of the product
   * @param {UpdateProductInput} data - the data to update the product
   * @return {Promise<{ message: string }>} a promise with a success message
   */
  @Mutation(() => MessagePayload, { name: 'updateProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.SELLER, UserRole.ADMIN])
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') data: UpdateProductInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    const { role, id: userId } = user;
    return await this.productService.updateProduct(data, {
      productId: id,
      userId,
      role,
    });
  }
}
