import { createSlice } from "@reduxjs/toolkit";
import { getProductDetail } from "@service/product";
import { generateDummyCart } from "@util/generator/cart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    quantity: 0,
  },
  reducers: {
    setCart(state, action) {
      state.items = action.payload.cart;
      state.quantity = action.payload.cart.length;
    },
    addItem(state, action) {
      const product = action.payload.product;
      const quantity = action.payload.quantity;
      const existingItem = state.items.find(
        (item) => item.product_id._id === product._id
      );
      if (!existingItem) {
        state.items.push({
          quantity:quantity,
          product_id:product,
        });
        state.quantity = state.items.length;
      } else {
        existingItem.quantity = quantity;
      }
    },
    removeItem(state, action) {
      const productId = action.payload.id;
      const existingItem = state.items.find(
        (item) => item.product_id._id === productId
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) => item.product_id._id !== productId
        ); // Remove the item
        state.quantity = state.items.length;
      }
    },
    removeAllItem(state) {
      state.items = []; // Remove the item
      state.quantity = 0;
    },
    // Define other actions like updateQuantity, clearCart, etc.
  },
});

export const { addItem, removeItem, setCart,removeAllItem } = cartSlice.actions;
export default cartSlice.reducer;
