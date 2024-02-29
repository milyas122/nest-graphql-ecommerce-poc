import {
  Field,
  Int,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { BaseResponseDto } from 'src/common/dto';

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
class GetOrderHistory {
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
export class GetOrderHistoryPayload extends BaseResponseDto {
  @Field((type) => GetOrderHistory)
  data: GetOrderHistory;
}

@ObjectType()
class OrderDetail extends OmitType(Order, ['buyer', 'seller']) {}

@ObjectType()
export class OrderDetailPayload extends BaseResponseDto {
  @Field((type) => OrderDetail)
  data: OrderDetail;
}

@ObjectType()
class CancelOrder extends OmitType(Order, [
  'buyer',
  'seller',
  'productOrders',
]) {}

@ObjectType()
export class CancelOrderPayload extends BaseResponseDto {
  @Field((type) => CancelOrder)
  data: CancelOrder;
}

@ObjectType()
class UpdateOrderStatus extends OmitType(Order, [
  'buyer',
  'seller',
  'productOrders',
]) {}

@ObjectType()
export class UpdateOrderStatusPayload extends BaseResponseDto {
  @Field((type) => UpdateOrderStatus)
  data: UpdateOrderStatus;
}
