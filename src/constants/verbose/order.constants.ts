import { OrderStatus } from 'src/order/interfaces';

export const orderConstants = {
  orderStatusMustNotBeEmpty: 'order status must not be empty',
  productIdNotEmpty: 'product id must not be empty',
  quantityNotEmpty: 'quantity must not be empty',
  quantityMustBeAtLeastOne: 'quantity must be at least 1',
  productArrayNotEmpty: 'products array must not be empty',
  productsMustBeArray: 'products must be an array',
  orderNotFound: 'order not found',
  productOutOfStock: (productName: string) =>
    `product ${productName} is out of stock`,
  orderCanNotBeCancelled: (orderId) =>
    `order (${orderId}) can not be cancelled`,
  orderStatusCanNotBeUpdated: (orderId) =>
    `order (${orderId}) status can not be updated`,
  statusShouldBeOneOf: `status should be one of ${Object.values(OrderStatus).join(', ')}`,
};
