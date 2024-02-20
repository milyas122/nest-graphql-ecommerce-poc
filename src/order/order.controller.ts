import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto';
import { OrderService } from './order.service';
import { IJwtPayload } from 'src/product/interfaces';
import { JwtAuthGuard } from 'src/guards';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() data: CreateOrderDto, @Req() req: Request) {
    const { id: userId } = req.user as IJwtPayload;

    // product stock is not updating yet
    return await this.orderService.createOrder(data, userId);
  }
}
