import { OrderStatus } from './entities/order.entity';

export interface IOrderResponse {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}
