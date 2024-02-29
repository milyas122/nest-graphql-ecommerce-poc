/**
 * A function to generate a unique order number.
 *
 * @return {string} the generated order number
 */
export function generateOrderNumber(): string {
  return `order-${Date.now()}-${Math.random().toString(36).slice(-8)}`;
}
