import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import {
  ICreateProductResponse,
  IGetProductDetailResponse,
  IGetProductList,
  IJwtPayload,
  IRemoveProduct,
  IUpdateProduct,
} from './interfaces';
import { UserRole } from 'src/auth/entities/user.entity';
import { productConstants } from 'src/constants/verbose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    const seller = await this.authService.findOneBy({ id: user.id });
    const product = new Product({
      seller,
      ...data,
    });
    await this.productRepository.save(product);
    const { seller: sellerObj, ...newProduct } = product;
    return newProduct;
  }

  /**
   * Retrieves a list of products based on the specified page number.
   *
   * @param {number} pageNo - The page number for the product list
   * @return {Promise<IGetProductList>} An object containing the list of products, the total number of pages, and the total number of products
   */
  async getProducts(pageNo: number): Promise<IGetProductList> {
    const take = 4;
    const skip = (pageNo - 1) * take;
    const result = await this.productRepository.findAndCount({
      take,
      skip,
      relations: {
        seller: true,
      },
      select: {
        seller: {
          id: true,
          name: true,
        },
      },
    });
    return {
      products: result[0],
      current_page: pageNo,
      total_pages: Math.ceil(result[1] / take),
      total: result[1],
    };
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

  /**
   * Retrieves products by their IDs.
   *
   * @param {string[]} ids - array of product IDs
   * @return {Promise<Product[]>} Promise that resolves to an array of products
   */
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
