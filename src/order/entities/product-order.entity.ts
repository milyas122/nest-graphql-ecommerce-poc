import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal' })
  total_price: number;

  @ManyToOne(() => Product, (product) => product.productOrders)
  product: Product;

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Order;

  constructor(entity: Partial<ProductOrder>) {
    Object.assign(this, entity);
  }
}
