import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderController } from './order.controller';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, ProductOrder, Product, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
