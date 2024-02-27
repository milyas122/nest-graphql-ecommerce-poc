import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductOrder } from './product-order.entity';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Order {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  order_id: string;

  @Field()
  @Column({ nullable: true })
  status: string;

  @Field((type) => GraphQLISODateTime)
  @CreateDateColumn()
  created_at: Date;

  @Field((type) => GraphQLISODateTime)
  @UpdateDateColumn()
  updated_at: Date;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.buyerOrders)
  buyer: User;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.sellerOrders)
  seller: User;

  @Field((type) => [ProductOrder])
  @OneToMany(() => ProductOrder, (productOrder) => productOrder.order, {
    cascade: true,
  })
  productOrders: ProductOrder[];

  constructor(entity: Partial<Order>) {
    Object.assign(this, entity);
  }
}
