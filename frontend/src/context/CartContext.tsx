import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

import { useAuth } from "./AuthContext";
import type { CartItem } from "../types/cart";
import type { CartContextType } from "./context.types";

/* ------------------ Context ------------------ */

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

/* ------------------ Provider Props ------------------ */

type CartProviderProps = {
  children: ReactNode;
};

/* ------------------ Provider ------------------ */

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ Sync from auth ------------------ */

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && Array.isArray(user?.cart)) {
      setCart(user.cart as CartItem[]);
    } else {
      setCart([]);
    }
  }, [authLoading, isAuthenticated, user]);

  /* ------------------ Sync to server ------------------ */

  const syncCartToServer = async (updatedCart: CartItem[]): Promise<void> => {
    if (!user?.id) return;

    try {
      await api.patch(`/users/${user.id}`, {
        cart: updatedCart,
        updatedAt: new Date().toISOString(),
      });

      const updatedUser = { ...user, cart: updatedCart };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  /* ------------------ Actions ------------------ */

  const addToCart: CartContextType["addToCart"] = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    setLoading(true);

    try {
      const existingItem = cart.find((item) => item._id === product._id);
      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }

      setCart(updatedCart);
      await syncCartToServer(updatedCart);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart: CartContextType["removeFromCart"] = async (id) => {
    if (!isAuthenticated) return;

    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    await syncCartToServer(updatedCart);
    toast("Item removed from cart");
  };

  const updateQuantity: CartContextType["updateQuantity"] = async (
    id,
    newQuantity,
  ) => {
    if (!isAuthenticated || newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item,
    );

    setCart(updatedCart);
    await syncCartToServer(updatedCart);
  };

  const clearCart: CartContextType["clearCart"] = async () => {
    if (!isAuthenticated) return;

    setCart([]);
    await syncCartToServer([]);
  };

  /* ------------------ Derived values ------------------ */

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /* ------------------ Provider ------------------ */

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    totalPrice,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ------------------ Hook ------------------ */

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
