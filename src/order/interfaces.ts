import { UserRole } from 'src/auth/entities/user.entity';
import { OrderStatus } from './entities/order.entity';

export interface IOrderResponse {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICancelOrder {
  orderId: string;
  userId: string;
  role: UserRole;
}
