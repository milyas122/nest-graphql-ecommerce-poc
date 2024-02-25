import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { orderConstants } from 'src/constants/verbose';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: orderConstants.orderStatusMustNotBeEmpty })
  @IsEnum(OrderStatus, { message: orderConstants.statusShouldBeOneOf })
  status: OrderStatus;
}
