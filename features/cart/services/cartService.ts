import { left, right } from "../../../shared/core/either";
import { Result } from "../../../shared/core/result";
import { APIResponse } from "../../../shared/infra/services/apiResponse";
import axios from "../../../shared/infra/services/axiosInstance";

import { Cart } from "../models/cartModel";
import { CartUtils } from "../utils/CartUtils";

interface ICartService {
  addItemToCart(itemId: string): Promise<APIResponse<Cart>>;
  removeItemFromCart(itemId: string): Promise<APIResponse<Cart>>;
  getCart(): Promise<APIResponse<Cart>>;
  proceedToCheckout(cartId: string): Promise<APIResponse<void>>;
}

export class CartService implements ICartService {
  async proceedToCheckout(cartId: string): Promise<APIResponse<void>> {
    try {
      await axios.post("/cart/proceed-checkout", { cartId });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }
  async getCart(): Promise<APIResponse<Cart>> {
    try {
      const response = await axios.get("/api/cart");
      return right(Result.ok<Cart>(CartUtils.toViewModel(response.data.cart)));
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }
  async addItemToCart(itemId: string): Promise<APIResponse<Cart>> {
    try {
      const response = await axios.post("/cart", { itemId });
      return right(Result.ok<Cart>(CartUtils.toViewModel(response.data.cart)));
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  async removeItemFromCart(itemId: string): Promise<APIResponse<Cart>> {
    try {
      const response = await axios.post("/cart/remove-item", { itemId });
      return right(Result.ok<Cart>(CartUtils.toViewModel(response.data.cart)));

      //return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }
}
