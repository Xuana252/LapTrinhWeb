import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { changeOrderingState } from "./orderState";

export const setOrderStateAsync = createAsyncThunk(
  "order/setOrderStateAsync",
  async (state) => {
    // Perform any async operations here (e.g., API call)
    await changeOrderingState(state);

    return state
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    order_items: [],
    order_address: null,
    order_voucher: null,  
    order_payment_method: "",
    order_state:0,
  },
  reducers: {
    setOrderItems(state, action) {
      state.order_items = action.payload.items;
    },
    setOrderAddress(state, action) {
      state.order_address = action.payload.address;
    },
    setOrderPaymentMethod(state, action) {
      state.order_payment_method = action.payload.payment_method;
    },
    setOrderVoucher(state, action) {
      state.order_voucher = action.payload.voucher;  // Reducer to set the voucher
    },
    setOrderState(state,action) {
        state.order_state = action.payload
    },
    clearOrder(state) {
      state.order_items = [];
      state.order_address = {};
      state.order_voucher = {};  // Clear the voucher
      state.order_payment_method = "";
      state.order_state=0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setOrderStateAsync.pending, (state) => {
        // Optional: Set loading state or other flags
      })
      .addCase(setOrderStateAsync.fulfilled, (state, action) => {
        state.order_state = action.payload  ;  // Update order state after async operation
      })
      .addCase(setOrderStateAsync.rejected, (state, action) => {
        // Optional: Handle errors here (e.g., set an error state)
        console.error('Error setting order state:', action.error);
      });
  }
});

export const {
  setOrderItems,
  setOrderAddress,
  setOrderPaymentMethod,
  setOrderVoucher,  // Export the new setOrderVoucher action
  clearOrder,
  setOrderState,
} = orderSlice.actions;
export default orderSlice.reducer;
