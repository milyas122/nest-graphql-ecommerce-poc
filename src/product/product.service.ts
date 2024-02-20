import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto';
import { IJwtPayload } from './interfaces';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(data: CreateProductDto, user: IJwtPayload) {
    const product = new Product({
      seller_id: user.id,
      ...data,
    });

    await this.entityManager.save(product);
    return product;
  }
}
