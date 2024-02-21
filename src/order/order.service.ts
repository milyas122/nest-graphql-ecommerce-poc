import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { Order, OrderStatus } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { CreateOrderDto } from './dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { orderConstants } from 'src/constants/verbose';
import { IOrderResponse } from './interfaces';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
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
    const buyer = await this.userRepository.findOneBy({ id: userId });
    const orderNo = await this._generateOrderNumber();
    const order = new Order({
      order_id: orderNo,
      status: OrderStatus.PROCESSING,
      productOrders,
      buyer,
    });
    await this.entityManager.save(order);
    const {
      buyer: buyerObj,
      productOrders: productOrdersObj,
      ...result
    } = order;
    return result;
  }

  private async _checkProductInventory({ products }: CreateOrderDto) {
    const productIds = products.map(({ productId }) => productId);

    const productsList = await this.productRepository.find({
      where: { id: In(productIds) },
    });

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

  private async _generateOrderNumber() {
    return `order-${Date.now()}-${Math.random().toString(36).slice(-8)}`;
  }
}
