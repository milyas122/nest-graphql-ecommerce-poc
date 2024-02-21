import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal' })
  total_price: number;

  @ManyToOne(() => Product, (product) => product.productOrders, {
    cascade: true,
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Order;

  constructor(entity: Partial<ProductOrder>) {
    Object.assign(this, entity);
  }
}
