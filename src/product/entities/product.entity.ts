import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { ProductOrder } from 'src/order/entities/product-order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: ProductOrder[];

  constructor(entity: Partial<Product>) {
    Object.assign(this, entity);
  }
}
