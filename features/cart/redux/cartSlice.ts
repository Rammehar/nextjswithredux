import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Cart } from "../models/cartModel";
import { cartService } from "../services";

type StatusType = "idle" | "loading" | "succeeded" | "failed";

interface CartState {
  cart: Cart | {};
  fetchCartStatus: StatusType;
  addItemToCartStatus: StatusType;
  removeItemFromCartStatus: StatusType;
  proceedToCheckoutStatus: StatusType;
  error: string | null;
}

const initialState: CartState = {
  cart: {},
  fetchCartStatus: "idle",
  addItemToCartStatus: "idle",
  removeItemFromCartStatus: "idle",
  proceedToCheckoutStatus: "idle",
  error: null,
};

export const getCart = createAsyncThunk<Cart, void>(
  "cart/getCart",
  async (req, thunkAPI) => {
    try {
      const result = await cartService.getCart();
      if (result.isLeft()) {
        const error: string = result.value;
        return thunkAPI.rejectWithValue(error);
      } else {
        return result.value.getValue();
      }
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addItemToCart = createAsyncThunk<Cart, { itemId: string }>(
  "cart/addItemToCart",
  async ({ itemId }, thunkAPI) => {
    const result = await cartService.addItemToCart(itemId);
    if (result.isLeft()) {
      const error: string = result.value;
      return thunkAPI.rejectWithValue(error);
    } else {
      return result.value.getValue();
    }
  }
);

export const removeItemFromCart = createAsyncThunk<Cart, { itemId: string }>(
  "cart/removeItemFromCart",
  async ({ itemId }, thunkAPI) => {
    const result = await cartService.removeItemFromCart(itemId);
    if (result.isLeft()) {
      const error: string = result.value;
      return thunkAPI.rejectWithValue(error);
    } else {
      return result.value.getValue();
    }
  }
);

export const proceedToCheckout = createAsyncThunk<void, { cartId: string }>(
  "cart/proceedToCheckout",
  async ({ cartId }, thunkAPI) => {
    const result = await cartService.proceedToCheckout(cartId);
    if (result.isLeft()) {
      const error: string = result.value;
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.fetchCartStatus = "loading";
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.fetchCartStatus = "failed";
        if (action.payload) {
          state.error = action.payload as string;
          // throw new Error(action.payload as string);
        }
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.fetchCartStatus = "succeeded";
        state.error = null;
        state.cart = action.payload;
      })

      .addCase(addItemToCart.pending, (state) => {
        state.addItemToCartStatus = "loading";
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.addItemToCartStatus = "failed";
        if (action.payload) {
          state.error = action.payload as string;
        }
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.addItemToCartStatus = "succeeded";
        state.error = null;
        state.cart = action.payload;
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.removeItemFromCartStatus = "loading";
        state.error = null;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.removeItemFromCartStatus = "failed";
        if (action.payload) {
          state.error = action.payload as string;
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.removeItemFromCartStatus = "succeeded";
        state.cart = action.payload;
        state.error = null;
      })

      .addCase(proceedToCheckout.pending, (state) => {
        state.proceedToCheckoutStatus = "loading";
        state.error = null;
      })
      .addCase(proceedToCheckout.rejected, (state, action) => {
        state.proceedToCheckoutStatus = "failed";
        if (action.payload) {
          state.error = action.payload as string;
        }
      })
      .addCase(proceedToCheckout.fulfilled, (state, action) => {
        state.proceedToCheckoutStatus = "succeeded";
        state.error = null;
      });
  },
});

export default cartSlice.reducer;
