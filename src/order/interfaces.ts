import { UserRole } from 'src/auth/entities/user.entity';
import { OrderStatus } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';

export interface IOrderResponse {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  buyerId: string;
  sellerId: string;
  productOrders: ProductOrder[];
}

export interface ICancelOrder {
  orderId: string;
  userId: string;
  role: UserRole;
}

export interface IUpdatedProductInventory {
  sellerIds: string[];
  sellerProductOrders: Record<string, ProductOrder[]>;
}
