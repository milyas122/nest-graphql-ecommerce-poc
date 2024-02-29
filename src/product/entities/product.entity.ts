import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
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

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.products)
  seller: Relation<User>;

  @Field((type) => [ProductOrder])
  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: Relation<ProductOrder[]>;

  constructor(entity: Partial<Product>) {
    Object.assign(this, entity);
  }
}
