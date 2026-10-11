import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from 'types';
import { toast } from 'react-toastify';

export interface ProductState {
  products: Product[];
  favourites: Product[];
  cart: Product[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
}

const initialState: ProductState = {
  products: [],
  favourites: [],
  cart: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

type CartTotal = {
  total: number;
  quantity: number;
};

const loadState = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key);

    if (serializedState === null) {
      return;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    toast.error('The page can\'t load');
  }
};

const saveState = (key: string, state: Product[]) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch {
    toast.error('The product has not been removed');
  }
};

const productSlice = createSlice({
  name: 'product',
  initialState: {
    ...initialState,
    favourites: loadState('favourites') || initialState.favourites,
    cart: loadState('cart') || initialState.cart,
  },
  reducers: {
    setFavourites: (state, action: PayloadAction<Product[]>) => {
      state.favourites = action.payload;
      saveState('favourites', action.payload);
    },
    setCart: (state, action: PayloadAction<Product[]>) => {
      state.cart = action.payload;
      saveState('cart', action.payload);
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addToFavourites: (state, action: PayloadAction<Product>) => {
      const productToAdd: Product = action.payload;
      state.favourites.push(productToAdd);
      saveState('favourites', state.favourites);
    },
    removeFromFavourites: (state, action: PayloadAction<Product>) => {
      const productToRemove: Product = action.payload;
      const index = state.favourites.findIndex(
        (product: Product) => product.id === productToRemove.id,
      );
      if (index !== -1) {
        state.favourites.splice(index, 1);
        saveState('favourites', state.favourites);
      }
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const index = state.cart.findIndex(
        (product: Product) => product.id === action.payload.id,
      );

      if (index >= 0) {
        state.cart[index] = {
          ...state.cart[index],
          quantity: state.cart[index].quantity + 1,
        };
      } else {
        const productToAdd = { ...action.payload, quantity: 1 };
        state.cart.push(productToAdd);
      }

      saveState('cart', state.cart);
    },

    removeFromCart: (state, action: PayloadAction<Product>) => {
      const productToRemove: Product = action.payload;
      const index = state.cart.findIndex(
        (product: Product) => product.id === productToRemove.id,
      );
      if (index !== -1) {
        state.cart.splice(index, 1);
        saveState('cart', state.cart);
      }
    },

    decreaseCart: (state, action: PayloadAction<Product>) => {
      const decreaseItem = state.cart.find(
        (item: Product) => item.id === action.payload.id,
      );
      if (decreaseItem && decreaseItem.quantity > 1) {
        decreaseItem.quantity -= 1;
        saveState('cart', state.cart);
      }
    },

    getTotals(state) {
      // eslint-disable-next-line prefer-const
      let { total, quantity } : CartTotal = state.cart.reduce(
        (cartTotal: CartTotal, cartItem: Product) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += quantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        },
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },

    clearCart(state) {
      state.cart = [];
      saveState('cart', state.cart);
  },
  },
});

export const {
  setFavourites,
  setCart,
  setProducts,
  addToFavourites,
  removeFromFavourites,
  addToCart,
  removeFromCart,
  decreaseCart,
  getTotals,
  clearCart,
} = productSlice.actions;

export default productSlice.reducer;
