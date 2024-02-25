import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateOrderDto } from './dto';
import { OrderService } from './order.service';
import { IJwtPayload } from 'src/product/interfaces';
import { JwtAuthGuard, RolesGuard } from 'src/guards';
import { SuccessResponse, sendSuccessResponse } from 'src/utils';
import { Roles } from 'src/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Creates an order using the provided data and user request.
   *
   * @param {CreateOrderDto} data - the data for creating the order
   * @param {Request} req - the user request object
   * @return {Promise<SuccessResponse>} success response with the created order data details
   */
  @Post()
  @Roles(UserRole.BUYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createOrder(
    @Body() data: CreateOrderDto,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId } = req.user as IJwtPayload;
    const result = await this.orderService.createOrder(data, userId);
    return sendSuccessResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
    });
  }

  /**
   * Get a list of product orders.
   *
   * @param {number} page - pagination filter params
   * @param {string} q - search filter query params
   * @param {Request} req - express request object
   * @return {Promise<SuccessResponse>} success response with order list object
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrderHistory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('q', new DefaultValuePipe(undefined)) q: string,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId, role } = req.user as IJwtPayload;
    const data = await this.orderService.getOrderHistory({
      userId,
      role,
      page,
      q,
    });
    return sendSuccessResponse({
      statusCode: HttpStatus.OK,
      data,
    });
  }

  /**
   * Retrieves the order details for a given ID.
   *
   * @param {string} id - the ID of the order from url params
   * @param {Request} req - the express request object
   * @return {Promise<SuccessResponse>} the object containing the order details
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId, role } = req.user as IJwtPayload;
    const result = await this.orderService.getOrderById({
      orderId: id,
      role,
      userId,
    });
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  /**
   * Cancels an order.
   *
   * @param {string} id - the id of the order to be canceled
   * @return {Promise<SuccessResponse>} success response with the cancelled order detail
   */
  @Get(':id/cancel') // Code review question regarding request method
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<SuccessResponse> {
    const { id: userId, role } = req.user as IJwtPayload;
    const order = await this.orderService.cancelOrder({
      orderId: id,
      userId,
      role,
    });
    return sendSuccessResponse({
      statusCode: HttpStatus.OK,
      data: order,
    });
  }
}
