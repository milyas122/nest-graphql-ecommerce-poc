import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { orderConstants } from 'src/constants/verbose';
import {
  IGetOrderHistoryParams,
  ICancelOrder,
  IOrderResponse,
  IUpdatedProductInventory,
  IGetOrderHistoryResult,
  IGetOrderDetailParams,
  IUpdateOrderStatusParams,
} from './interfaces';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';
import { UserRole } from 'src/auth/interfaces';
import { OrderStatus } from './dto';
import { CreateOrderInput } from './dto/inputs';

@Injectable()
export class OrderService {
  constructor(
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Create an order with the given products for a specific user.
   *
   * @param {CreateOrderDto} products - the products to be included in the order
   * @param {string} userId - the id of the user placing the order
   * @return {Promise<IOrderResponse>} the response containing the created orders details
   */
  async createOrder(
    { products }: CreateOrderInput,
    userId: string,
  ): Promise<IOrderResponse[]> {
    const { sellerIds, sellerProductOrders } =
      await this._updateProductInventory({
        products,
      });
    const buyer = await this.authService.findOneBy({ id: userId });
    const sellers = await this.authService.findSellerByIds(sellerIds);
    const orders = sellers.map((seller) => {
      return new Order({
        order_id: this._generateOrderNumber(),
        status: OrderStatus.PROCESSING,
        productOrders: sellerProductOrders[seller.id],
        seller,
        buyer,
      });
    });
    await this.orderRepository.save(orders);
    const result = orders.map((order) => {
      const { seller, buyer, ...data } = order;
      return {
        ...data,
        sellerId: seller.id,
        buyerId: buyer.id,
      };
    });
    return result;
  }

  /**
   * Update product inventory based on the provided order data.
   *
   * @param {CreateOrderDto} products - the order data including products
   * @return {Promise<IUpdatedProductInventory>} a object which contains a list of seller ids and a list of seller specific product orders
   */
  private async _updateProductInventory({
    products,
  }: CreateOrderInput): Promise<IUpdatedProductInventory> {
    const productIds = products.map(({ productId }) => productId);
    const productsList = await this.productService.getProductsByIds(productIds);
    const productQuantityObjs = products.reduce(
      (acc, { productId, quantity }) => {
        if (!acc[productId]) {
          acc[productId] = { quantity };
        }
        return acc;
      },
      {},
    );
    const sellerIds = [];
    const sellerProductOrders: Record<string, ProductOrder[]> = {};
    // check product inventory before creating an order
    productsList.forEach((product) => {
      if (productQuantityObjs[product.id].quantity > product.stock) {
        throw new BadRequestException(
          orderConstants.productOutOfStock(product.title),
        );
      }
      if (!sellerProductOrders.hasOwnProperty(product.seller.id)) {
        sellerProductOrders[product.seller.id] = [];
        sellerIds.push(product.seller.id);
      }
      // Update product inventory
      product.stock -= productQuantityObjs[product.id].quantity;
      let productOrder = new ProductOrder({
        product,
        quantity: productQuantityObjs[product.id].quantity,
        total_price: product.price * productQuantityObjs[product.id].quantity,
      });
      sellerProductOrders[product.seller.id].push(productOrder);
    });
    return { sellerProductOrders, sellerIds };
  }

  /**
   * Cancels an order by its ID.
   *
   * @param {string} orderId - the ID of the order to be cancelled
   * @return {Promise<Order>} the cancelled order object
   */
  async cancelOrder({ orderId, userId, role }: ICancelOrder): Promise<Order> {
    const where = { id: orderId };
    if (role != UserRole.ADMIN) {
      where[role] = { id: userId }; // seller or buyer specific
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
   * Retrieves the order history or search by product title.
   *
   * @param {IGetOrderHistoryParams} data - the parameters for retrieving order history
   * @return {Promise<IGetOrderHistoryResult>} An object containing the list of orders, the total number of pages, and the total number of products
   */
  async getOrderHistory(
    data: IGetOrderHistoryParams,
  ): Promise<IGetOrderHistoryResult> {
    const { userId, role, page, q } = data;
    const skip = page * (page - 1);
    const limit = 5;
    const where = {};
    if (role != UserRole.ADMIN) {
      where[role] = { id: userId }; // seller and buyer specific order
    }
    if (q) {
      where['productOrders'] = {
        product: {
          title: ILike(`%${q}%`),
        },
      }; // search by product title
    }
    const result = await this.orderRepository.findAndCount({
      where,
      take: limit,
      skip,
      relations: {
        productOrders: true,
      },
    });
    return {
      orders: result[0],
      current_page: page,
      total_pages: Math.ceil(result[1] / limit),
      total: result[1],
    };
  }

  /**
   * Get order details by order ID.
   *
   * @param {IGetOrderDetailParams} orderId - The ID of the order
   * @param {IGetOrderDetailParams} userId - The ID of the user
   * @param {IGetOrderDetailParams} role - The role of the user
   * @return {Promise<Order>} returns an object containing the order details
   */
  async getOrderById({
    orderId,
    userId,
    role,
  }: IGetOrderDetailParams): Promise<Order> {
    const where = { id: orderId };
    if (role != UserRole.ADMIN) {
      where[role] = { id: userId }; // seller and buyer specific order
    }
    const order = await this.orderRepository.findOne({
      where,
      relations: {
        productOrders: true,
      },
    });
    if (!order) {
      throw new BadRequestException(orderConstants.orderNotFound);
    }
    return order;
  }

  /**
   * Update the order status based on the provided data.
   *
   * @param {IUpdateOrderStatusParams} data - data object contains the order ID, user ID, role, and status to be updated
   * @return {Promise<Order>} the updated order
   */
  async updateOrderStatus(data: IUpdateOrderStatusParams): Promise<Order> {
    const { orderId, userId, role, status } = data;
    const where = { id: orderId };
    if (role != UserRole.ADMIN) {
      where[role] = { id: userId }; // seller and buyer specific order
    }
    const order = await this.orderRepository.findOne({
      where,
    });
    if (!order) {
      throw new BadRequestException(orderConstants.orderNotFound);
    }
    if (
      [OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(
        order.status as OrderStatus,
      )
    ) {
      throw new BadRequestException(
        orderConstants.orderStatusCanNotBeUpdated(order.order_id),
      );
    }
    order.status = status;
    await this.orderRepository.save(order);
    return order;
  }

  /**
   * A function to generate a unique order number.
   *
   * @return {string} the generated order number
   */
  private _generateOrderNumber(): string {
    return `order-${Date.now()}-${Math.random().toString(36).slice(-8)}`;
  }
}
