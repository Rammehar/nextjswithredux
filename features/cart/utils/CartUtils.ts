import { CartDTO } from "../dtos/cartDTO";
import { Cart } from "../models/cartModel";

export class CartUtils {
  public static toViewModel(dto: CartDTO): Cart {
    return {
      cartId: dto.cartId,
      cartItems: dto.cartItems,
      totalNumCartItems: dto.totalNumCartItems,
      cartPrice: dto.cartPrice,
      isLocked: dto.isLocked,
    };
  }
}
