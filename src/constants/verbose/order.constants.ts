export const orderConstants = {
  productIdNotEmpty: 'product id must not be empty',
  quantityNotEmpty: 'quantity must not be empty',
  productArrayNotEmpty: 'products array must not be empty',
  productsMustBeArray: 'products must be an array',
  productOutOfStock: (productName: string) =>
    `product ${productName} is out of stock`,
};
