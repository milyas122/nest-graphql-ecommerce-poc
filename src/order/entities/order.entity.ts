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

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_id: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.buyerOrders)
  buyer: User;

  @ManyToOne(() => User, (user) => user.sellerOrders)
  seller: User;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.order, {
    cascade: true,
  })
  productOrders: ProductOrder[];

  constructor(entity: Partial<Order>) {
    Object.assign(this, entity);
  }
}
