'use client'
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice'
import sessionReducer from './session/sessionSlice'
import orderReducer from './order/orderSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage
import thunk from 'redux-thunk';


const persistConfig = {
  key:'root',
  storage,
}

const persistedOrderReducer = persistReducer(persistConfig, orderReducer);

const store = configureStore({
  reducer: {
    order: persistedOrderReducer,
    cart: cartReducer,
    session: sessionReducer, 
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these actions for serializability check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export  {store,persistor};
