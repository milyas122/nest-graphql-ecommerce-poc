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
import { Order } from './entities/order.entity';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  /**
   * A getOrderHistory resolver that returns the order history of a login user
   *
   * @param {number} page - a page number for pagination
   * @param {string} q - a query string for filtering the orders by title
   * @return {Promise<GetOrderHistoryPayload>} returns the list of orders information
   */
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

  /**
   * A resolver to retrieve order details by its id.
   *
   * @param {string} id - the ID of the order
   * @return {Promise<OrderDetailPayload>} returns the detail information of an order
   */
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

  /**
   * A resolver to change the shipping status of an order
   *
   * @param {string} id - the ID of the order
   * @param {UpdateOrderStatusInput} status - the updated status of the order
   * @return {Promise<UpdateOrderStatusPayload>} the updated order status payload
   */
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
