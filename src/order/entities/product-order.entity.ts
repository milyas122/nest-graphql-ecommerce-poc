import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductOrder {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((type) => Int)
  @Column()
  quantity: number;

  @Field((type) => Int)
  @Column({ type: 'decimal' })
  total_price: number;

  @ManyToOne(() => Product, (product) => product.productOrders, {
    cascade: true,
  })
  product: Relation<Product>;

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Relation<Order>;

  constructor(entity: Partial<ProductOrder>) {
    Object.assign(this, entity);
  }
}
