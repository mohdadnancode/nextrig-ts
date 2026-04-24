import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Auth/useAuth";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/cart";
import type { CartContextType } from "../context.types";
import {
  getCartAPI,
  addToCartAPI,
  removeFromCartAPI,
  updateCartAPI,
  clearCartAPI,
} from "../../services/cartService";

type CartProviderProps = { children: ReactNode };

export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* -- FETCH CART -- */
  const fetchCart = async () => {
    try {
      const res = await getCartAPI();
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed", err);
      toast.error("Fetch cart failed");
    }
  };

  /* -- INIT -- */

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  /* -- ADD -- */

  const addToCart: CartContextType["addToCart"] = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      await addToCartAPI(product._id);

      await fetchCart();
      toast.success(`${product.name} added`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  /* -- REMOVE -- */

  const removeFromCart = async (id: string) => {
    try {
      await removeFromCartAPI(id);

      setCart((prev) => prev.filter((item) => item._id !== id));

      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* -- UPDATE -- */

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartAPI(id, quantity);

      setCart((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* -- CLEAR -- */

  const clearCart: CartContextType["clearCart"] = async () => {
    try {
      await clearCartAPI();
      setCart([]);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* -- CALCULATIONS -- */

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

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
