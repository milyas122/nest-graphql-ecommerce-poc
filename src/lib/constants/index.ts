export { authConstants } from './auth.constants';
export { orderConstants } from './order.constants';
export { productConstants } from './product.constants';

export const appConstants = {
  forbiddenAccess: (...args: string[]) =>
    `only ${args.join(' or ')} can access this route`,
  serverError: 'Internal server error',
};
