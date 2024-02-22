import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { CreateOrderDto } from './dto';
import { orderConstants } from 'src/constants/verbose';
import { ICancelOrder, IOrderResponse } from './interfaces';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';
import { UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
  ) {}

  /**
   * Create an order with the given products for a specific user.
   *
   * @param {CreateOrderDto} products - the products to be included in the order
   * @param {string} userId - the id of the user placing the order
   * @return {Promise<IOrderResponse>} the response containing the created order details
   */
  async createOrder(
    { products }: CreateOrderDto,
    userId: string,
  ): Promise<IOrderResponse> {
    const productOrders = await this._checkProductInventory({ products });
    const buyer = await this.authService.findOneBy({ id: userId });
    const orderNo = await this._generateOrderNumber();
    const order = new Order({
      order_id: orderNo,
      status: OrderStatus.PROCESSING,
      productOrders,
      buyer,
    });
    await this.orderRepository.save(order);
    const {
      buyer: buyerObj,
      productOrders: productOrdersObj,
      ...result
    } = order;
    return result;
  }

  /**
   * Cancels an order by its ID.
   *
   * @param {string} orderId - the ID of the order to be cancelled
   * @return {Promise<Order>} the cancelled order object
   */
  async cancelOrder({ orderId, userId, role }: ICancelOrder): Promise<Order> {
    const where = { id: orderId };
    if ((role = UserRole.BUYER)) {
      where['buyer'] = { id: userId };
    }
    const order = await this.orderRepository.findOne({
      where,
    });
    if (!order) {
      throw new BadRequestException(orderConstants.orderNotFound);
    }
    if (order.status != OrderStatus.PROCESSING) {
      throw new BadRequestException(
        orderConstants.orderCanNotBeCancelled(order.order_id),
      );
    }
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
    return order;
  }

  /**
   * Check product inventory before creating an order and update product inventory.
   *
   * @param {CreateOrderDto} products - object containing products for the order
   * @return {Promise<ProductOrder[]>} list of product orders
   */
  private async _checkProductInventory({ products }: CreateOrderDto) {
    const productIds = products.map(({ productId }) => productId);
    const productsList = await this.productService.getProductsByIds(productIds);
    const productObjList = products.reduce((acc, { productId, quantity }) => {
      if (!acc[productId]) {
        acc[productId] = quantity;
      }
      return acc;
    }, {});
    // check product inventory before creating an order
    const productOrders = productsList.map((product) => {
      if (productObjList[product.id] > product.stock) {
        throw new BadRequestException(
          orderConstants.productOutOfStock(product.title),
        );
      }
      // Update product inventory
      product.stock -= productObjList[product.id]; // stock - quantity
      return new ProductOrder({
        product,
        quantity: productObjList[product.id], // get quantity from productObjList
        total_price: product.price * productObjList[product.id],
      });
    });
    return productOrders;
  }

  /**
   * A function to generate a unique order number.
   *
   * @return {string} the generated order number
   */
  private async _generateOrderNumber(): Promise<string> {
    return `order-${Date.now()}-${Math.random().toString(36).slice(-8)}`;
  }
}
