import { IsEnum, IsNotEmpty } from 'class-validator';
import { orderConstants } from 'src/lib/constants';
import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from '..';

@InputType()
export class UpdateOrderStatusInput {
  @Field((type) => OrderStatus)
  @IsNotEmpty({ message: orderConstants.orderStatusMustNotBeEmpty })
  @IsEnum(OrderStatus, { message: orderConstants.statusShouldBeOneOf })
  status: OrderStatus;
}
