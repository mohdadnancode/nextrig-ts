import type { Dispatch, SetStateAction } from "react";
import type { User } from "../types/user";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<{
    message: string; success: boolean 
}>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; email?: string; message?: string; field?: string; }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean }>;
  resendOTP: (email: string) => Promise<{ success: boolean }>;
  logout: () => void;
  setAuthError: Dispatch<SetStateAction<string>>;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  totalPrice: number;
  loading: boolean;
};

export type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
  loading: boolean;
};
