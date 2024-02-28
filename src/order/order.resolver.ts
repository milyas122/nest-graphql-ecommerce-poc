import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { CreateOrderInput } from './dto/inputs';
import { CurrentUser } from 'src/current-user.decorator';
import { JwtPayload } from 'src/product/dto';
import { OrderService } from './order.service';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { UserRole } from 'src/auth/interfaces';
import {
  CancelOrderPayload,
  GetOrderHistoryPayload,
  OrderDetailPayload,
  UpdateOrderStatusPayload,
} from './dto';
import { UpdateOrderStatusInput } from './dto/inputs/update-order.input';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query((type) => GetOrderHistoryPayload, { name: 'getOrderHistory' })
  @UseGuards(JwtAuthGuard)
  async getOrderHistory(
    @Args('page', { type: () => Int, defaultValue: 1, nullable: true })
    page: number,
    @Args('q', { type: () => String, nullable: true }) q: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<GetOrderHistoryPayload> {
    const { id: userId, role } = user;
    const data = await this.orderService.getOrderHistory({
      userId,
      role,
      page,
      q,
    });
    return data;
  }

  @Query((type) => OrderDetailPayload, { name: 'getOrderDetail' })
  @UseGuards(JwtAuthGuard)
  async getOrderDetail(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrderDetailPayload> {
    const { id: userId, role } = user;
    const result = await this.orderService.getOrderById({
      orderId: id,
      role,
      userId,
    });
    return result;
  }

  // not tested yet bcz of playground token issue
  @Mutation(() => String, { name: 'createOrder' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.BUYER])
  async createOder(
    @Args('createOrderInput') data: CreateOrderInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const { id: userId } = user;
    return await this.orderService.createOrder(data, userId);
  }

  @Mutation(() => CancelOrderPayload, { name: 'cancelOrder' })
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<CancelOrderPayload> {
    const { id: userId, role } = user;
    return await this.orderService.cancelOrder({
      orderId: id,
      role,
      userId,
    });
  }

  @Mutation(() => UpdateOrderStatusPayload, { name: 'updateOrderStatus' })
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Args('id') id: string,
    @Args('updateOrderStatusInput') { status }: UpdateOrderStatusInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<UpdateOrderStatusPayload> {
    const { id: userId, role } = user;
    return await this.orderService.updateOrderStatus({
      orderId: id,
      role,
      userId,
      status,
    });
  }
}
