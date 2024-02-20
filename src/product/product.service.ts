import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto';
import { IGetProductDetail, IJwtPayload, IRemoveProduct } from './interfaces';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  async createProduct(data: CreateProductDto, user: IJwtPayload) {
    const seller = await this.getSellerObj(user.id);

    const product = new Product({
      seller,
      ...data,
    });

    await this.entityManager.save(product);
    return product;
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

  // admin access bug
  async getProductDetail({ productId, userId, role }: IGetProductDetail) {
    const where = {
      id: productId,
    };

    if (role === UserRole.SELLER) {
      where['seller'] = { id: userId };
    }

    const product = await this.productRepository.findOne({
      where: { ...where },
    });

    if (!product) {
      throw new BadRequestException('product not found');
    }
    return product;
  }

  async removeProduct({ productId, userId, role }: IRemoveProduct) {
    const where = {
      id: productId,
    };

    if (role === UserRole.SELLER) {
      where['seller'] = { id: userId };
    }

    const { affected } = await this.productRepository.delete({ ...where });

    if (affected === 0) {
      throw new BadRequestException('product not found');
    }
  }
  private async getSellerObj(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
}
