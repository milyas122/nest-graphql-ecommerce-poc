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

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => GetProductListPayload, { name: 'getProducts' })
  async getProducts(
    @Args('page', { type: () => Int }) page: number,
  ): Promise<GetProductListPayload> {
    return await this.productService.getProducts(page);
  }

  @Query(() => GetProductDetailPayload, { name: 'getProductDetail' })
  async getProductDetail(
    @Args('id') id: string,
  ): Promise<GetProductDetailPayload> {
    return await this.productService.getProductDetail(id);
  }

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
