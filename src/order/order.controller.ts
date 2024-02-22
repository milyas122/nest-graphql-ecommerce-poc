import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
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
