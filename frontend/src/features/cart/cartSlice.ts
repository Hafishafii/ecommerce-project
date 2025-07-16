import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';


export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    loading: false,
    error: null,
};


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        increaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item) item.quantity += 1;
        },
        decreaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload);
            if (!item) return;
            if (item?.quantity > 1) item.quantity -= 1
            else state.items?.filter(item => item?.id !== action?.payload)
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    setCart,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
