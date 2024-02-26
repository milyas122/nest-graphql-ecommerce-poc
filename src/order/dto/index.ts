export { CreateOrderDto } from './create-order.dto';
export { UpdateOrderStatusDto } from './update-order.dto';

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
