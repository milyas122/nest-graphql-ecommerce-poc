import {
  Field,
  Int,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';
import { Order } from '../entities/order.entity';

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class GetOrderHistoryPayload {
  @Field((type) => Int)
  current_page: number;

  @Field((type) => Int)
  total_pages: number;

  @Field((type) => Int)
  total: number;

  @Field((type) => [Order])
  orders: Order[];
}

@ObjectType()
export class OrderDetailPayload extends OmitType(Order, ['buyer', 'seller']) {}

@ObjectType()
export class CancelOrderPayload extends OmitType(Order, [
  'buyer',
  'seller',
  'productOrders',
]) {}

@ObjectType()
export class UpdateOrderStatusPayload extends OmitType(Order, [
  'buyer',
  'seller',
  'productOrders',
]) {}
