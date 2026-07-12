// hooks/useCart.tsx — Global cart state (Context + localStorage)
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import CartNotificationToast from '@/components/shop/CartNotificationToast';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; product: Product; quantity?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE'; productId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = action.quantity ?? 1;
      const existing = state.items.find(
        i => i.product.id === action.product.id,
      );

      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          ),
        };
      }

      return {
        items: [...state.items, { product: action.product, quantity: qty }],
      };
    }

    case 'REMOVE':
      return {
        items: state.items.filter(
          i => i.product.id !== action.productId,
        ),
      };

    case 'UPDATE':
      return {
        items: state.items
          .map(i =>
            i.product.id === action.productId
              ? { ...i, quantity: action.quantity }
              : i,
          )
          .filter(i => i.quantity > 0),
      };

    case 'CLEAR':
      return { items: [] };

    case 'LOAD':
      return { items: action.items };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  add: (
    product: Product,
    qty?: number,
    optionsLabel?: string,
  ) => void;
  remove: (productId: string) => void;
  update: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mithila_cart');
      if (saved) {
        dispatch({
          type: 'LOAD',
          items: JSON.parse(saved),
        });
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      'mithila_cart',
      JSON.stringify(state.items),
    );
  }, [state.items]);

  // Keep latest items available for toast quantity calculation
  const itemsRef = useRef(state.items);

  useEffect(() => {
    itemsRef.current = state.items;
  }, [state.items]);

  const totalItems = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    totalAmount,

    add: (
      product,
      qty = 1,
      optionsLabel,
    ) => {
      dispatch({
        type: 'ADD',
        product,
        quantity: qty,
      });

      const existing = itemsRef.current.find(
        i => i.product.id === product.id,
      );

      const nextQuantity =
        (existing?.quantity ?? 0) + qty;

      toast.custom(
        id => (
          <CartNotificationToast
            toastId={id}
            item={{
              product,
              quantity: nextQuantity,
            }}
            optionsLabel={optionsLabel}
          />
        ),
        {
          id: `cart-${product.id}`,
          duration: 5000,
        },
      );
    },

    remove: productId =>
      dispatch({
        type: 'REMOVE',
        productId,
      }),

    update: (productId, qty) =>
      dispatch({
        type: 'UPDATE',
        productId,
        quantity: qty,
      }),

    clear: () =>
      dispatch({
        type: 'CLEAR',
      }),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      'useCart must be used inside <CartProvider>',
    );
  }

  return ctx;
}