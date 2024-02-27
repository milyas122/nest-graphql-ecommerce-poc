import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductOrder } from 'src/order/entities/product-order.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => Int)
  @Column()
  price: number;

  @Field((type) => Int)
  @Column()
  stock: number;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @Field((type) => [ProductOrder])
  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: ProductOrder[];

  constructor(entity: Partial<Product>) {
    Object.assign(this, entity);
  }
}
