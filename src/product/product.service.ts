import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import {
  ICreateProductResponse,
  IGetProductDetailResponse,
  IJwtPayload,
  IRemoveProduct,
  IUpdateProduct,
} from './interfaces';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { productConstants } from 'src/constants/verbose';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Create a new product using the provided data and user information.
   *
   * @param {CreateProductDto} data - the data for creating the product
   * @param {IJwtPayload} user - the user object
   * @return {Promise<ICreateProductResponse>} the newly created product
   */
  async createProduct(
    data: CreateProductDto,
    user: IJwtPayload,
  ): Promise<ICreateProductResponse> {
    const seller = await this.getSellerObj(user.id);
    const product = new Product({
      seller,
      ...data,
    });
    await this.entityManager.save(product);
    const { seller: sellerObj, ...newProduct } = product;
    return newProduct;
  }

  async getProducts(userId: string, role: string) {
    if (role === 'admin') {
      return await this.productRepository.find();
    }
    return await this.productRepository.find({
      where: {
        seller: {
          id: userId,
        },
      },
    });
  }

  /**
   * Retrieves product details by ID.
   *
   * @param {string} id - The ID of the product
   * @return {Promise<IGetProductDetailResponse>} Return an object with the product details
   */
  async getProductDetail(id: string): Promise<IGetProductDetailResponse> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['seller'],
    });
    if (!product) {
      throw new BadRequestException(productConstants.productNotFound);
    }
    const { seller, ...result } = product;
    const { password, ...sellerWithoutPassword } = seller;
    return {
      ...result,
      seller: sellerWithoutPassword,
    };
  }

  /**
   * Remove a product based on the provided data.
   *
   * @param {IRemoveProduct} data - the data object containing productId, userId, and role
   * @return {Promise<{ message: string }>} a promise that resolves to an object with a message property
   */
  async removeProduct(data: IRemoveProduct): Promise<{ message: string }> {
    const { productId, userId, role } = data;
    const where = {
      id: productId,
    };
    // Check product owner because admin has also a right to remove products
    if (role === UserRole.SELLER) {
      where['seller'] = { id: userId };
    }
    const { affected } = await this.productRepository.delete({ ...where });
    if (affected === 0) {
      throw new BadRequestException(productConstants.productNotFound);
    }
    return {
      message: 'product deleted successfully',
    };
  }

  /**
   * Update a product with the provided data.
   *
   * @param {UpdateProductDto} updateDto - the data to update the product
   * @param {IUpdateProduct} data - an object containing the productId, userId and role for updating the product
   * @return {Promise<{ message: string }>} a message indicating the success of the update
   */
  async updateProduct(
    updateDto: UpdateProductDto,
    data: IUpdateProduct,
  ): Promise<{ message: string }> {
    const { productId, userId, role } = data;
    const where = {
      id: productId,
    };
    if (role === UserRole.SELLER) {
      where['seller'] = { id: userId };
    }
    const { affected } = await this.productRepository.update(where, updateDto);
    if (affected === 0) {
      throw new BadRequestException(productConstants.productNotFound);
    }
    return {
      message: 'product updated successfully',
    };
  }

  // get seller object
  //  get it from user services instead of user repository
  private async getSellerObj(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
}
