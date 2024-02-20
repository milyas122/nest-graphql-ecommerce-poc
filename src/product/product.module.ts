import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
