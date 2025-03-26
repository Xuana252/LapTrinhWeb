import { createSlice } from "@reduxjs/toolkit";
import { getProductDetail } from "@service/product";
import { generateDummyCart } from "@util/generator/cart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    customerId:'',
    items: [],
    quantity: 0,
  },
  reducers: {
    setCart(state, action) {
      state.customerId = action.payload.customerId;
      state.items = action.payload.cart;
      state.quantity = action.payload.cart.length;
    },
    addItem(state, action) {
      const product = action.payload.product;
      const quantity = action.payload.quantity;
      const existingItem = state.items.find(
        (item) => item.product_id === product.product_id
      );
      if (!existingItem) {
        const {categories,product_feedbacks,attributes,...rest} = product;
        state.items.push({
          customer_id:state.customerId,
          product_id:product.product_id,
          quantity:quantity,
          product:rest,
        });
        state.quantity = state.items.length;
      } else {
        existingItem.quantity = quantity;
      }
    },
    removeItem(state, action) {
      const productId = action.payload.id;
      const existingItem = state.items.find(
        (item) => item.product_id === productId
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) => item.product_id !== productId
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
