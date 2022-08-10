import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import userReducer from "../features/user/redux/userSlice";
import courseReducer from "../features/course/redux/courseSlice";
import cartReducer from "../features/cart/redux/cartSlice";

const combinedReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  cart: cartReducer,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState: ReturnType<typeof combinedReducer> = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const store = configureStore({
  reducer,
});
export const makeStore = () => {
  return store;
};

export type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<Store>(makeStore, {
  debug: false,
});
