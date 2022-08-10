import { CartItem } from "./cartItemModel";

export interface Cart {
  cartId: string;
  cartItems: CartItem[];
  totalNumCartItems: number;
  cartPrice: number;
  isLocked: boolean;
}
