import { UserRoleString } from 'src/auth/interfaces';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { OrderStatus } from './dto';

export interface IOrderResponse {
  id: string;
  order_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  buyerId: string;
  sellerId: string;
  productOrders: ProductOrder[];
}

export interface IGetOrderHistoryParams {
  userId: string;
  role: UserRoleString;
  page: number;
  q: string;
}

export interface IGetOrderHistoryResult {
  current_page: number;
  total_pages: number;
  total: number;
  orders: Order[];
}

export interface ICancelOrder {
  orderId: string;
  userId: string;
  role: UserRoleString;
}

export interface IUpdateOrderStatusParams extends ICancelOrder {
  status: OrderStatus;
}

export interface IGetOrderDetailParams extends ICancelOrder {}

export interface IUpdatedProductInventory {
  sellerIds: string[];
  sellerProductOrders: Record<string, ProductOrder[]>;
}
