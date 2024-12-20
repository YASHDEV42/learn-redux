import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";
const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: true,
};
const url = "https://course-api.com/react-useReducer-cart-project";
export const getCartItems = createAsyncThunk("cart/getCartItems", async () => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount += 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount -= 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      console.log("Fetched Data:", action.payload);
      state.isLoading = false;
      state.cartItems = action.payload || [];
    },
    [getCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});
export const { clearCart } = cartSlice.actions;
export const { removeItem } = cartSlice.actions;
export const { increase } = cartSlice.actions;
export const { decrease } = cartSlice.actions;
export const { calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
