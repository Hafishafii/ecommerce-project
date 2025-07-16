import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from '../features/cart';
import authReducer from './authSlice';


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer
    },
});