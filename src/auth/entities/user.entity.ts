import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { RolePermission } from './role.permission.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ nullable: true })
  role: string;

  @Field({ nullable: true })
  @Column()
  password: string;

  @Field((type) => [Product])
  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  products: Product[];

  @Field((type) => [Order])
  @OneToMany(() => Order, (order) => order.buyer, { cascade: true })
  buyerOrders: Order[];

  @Field((type) => [Order])
  @OneToMany(() => Order, (order) => order.seller, { cascade: true })
  sellerOrders: Order[];

  @ManyToMany(() => RolePermission, (rolePermission) => rolePermission.users)
  permissions: RolePermission[];

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
