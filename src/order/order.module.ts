import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ProductOrder]),
    AuthModule,
    ProductModule,
  ],
  controllers: [],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
