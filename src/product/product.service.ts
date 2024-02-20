import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto';
import { IJwtPayload } from './interfaces';
import { User } from 'src/auth/entities/user.entity';

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

    const seller = await this.getSellerObj(userId);

    return await this.productRepository.find({
      where: { seller },
    });
  }

  private async getSellerObj(id: string) {
    return await this.userRepository.findOneBy({ id });
  }
}
