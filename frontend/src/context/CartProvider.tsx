"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";

export type CartItemImage = {
  secure_url: string;
  public_id: string;
  id: number;
};

export type CartItem = {
  id: number;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  itemQuantity: number;
  itemImages: CartItemImage[];
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { id: number } }
  | { type: "CLEAR_CART" }
  | { type: "INCREMENT_ITEM"; payload: { id: number } }
  | { type: "DECREMENT_ITEM"; payload: { id: number } };

type CartContextValue = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.some((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, itemQuantity: item.itemQuantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, itemQuantity: 1 }];
    }

    case "REMOVE_FROM_CART": {
      return state.filter((item) => item.id !== action.payload.id);
    }

    case "CLEAR_CART": {
      return [];
    }

    case "INCREMENT_ITEM": {
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, itemQuantity: item.itemQuantity + 1 }
          : item
      );
    }

    case "DECREMENT_ITEM": {
      return state
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, itemQuantity: item.itemQuantity - 1 }
            : item
        )
        .filter((item) => item.itemQuantity > 0);
    }

    default: {
      return state;
    }
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item: CartItem): void => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (id: number): void => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const clearCart = (): void => {
    dispatch({ type: "CLEAR_CART" });
  };

  const incrementItem = (id: number): void => {
    dispatch({ type: "INCREMENT_ITEM", payload: { id } });
  };

  const decrementItem = (id: number): void => {
    dispatch({ type: "DECREMENT_ITEM", payload: { id } });
  };

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      incrementItem,
      decrementItem,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};