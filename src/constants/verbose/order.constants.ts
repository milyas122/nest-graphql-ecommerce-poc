export const orderConstants = {
  productIdNotEmpty: 'product id must not be empty',
  quantityNotEmpty: 'quantity must not be empty',
  quantityMustBeAtLeastOne: 'quantity must be at least 1',
  productArrayNotEmpty: 'products array must not be empty',
  productsMustBeArray: 'products must be an array',
  productOutOfStock: (productName: string) =>
    `product ${productName} is out of stock`,
};
