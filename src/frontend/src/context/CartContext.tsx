import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export interface CartItem {
  jerseyId: string;
  jerseyName: string;
  team: string;
  size: string;
  quantity: number;
  unitPrice: bigint;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (jerseyId: string, size: string) => void;
  updateQuantity: (jerseyId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: bigint;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.jerseyId === newItem.jerseyId && i.size === newItem.size,
      );
      if (existing) {
        return prev.map((i) =>
          i.jerseyId === newItem.jerseyId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((jerseyId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.jerseyId === jerseyId && i.size === size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (jerseyId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(jerseyId, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.jerseyId === jerseyId && i.size === size ? { ...i, quantity } : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.unitPrice * BigInt(i.quantity),
    BigInt(0),
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
