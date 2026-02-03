import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

import { useAuth } from "./AuthContext";
import type { WishlistContextType } from "./context.types";
import type { Product } from "../types/product";

/* ------------------ Context ------------------ */

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

/* ------------------ Provider ------------------ */

type WishlistProviderProps = {
  children: ReactNode;
};

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const { user, isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ Sync from auth ------------------ */

  useEffect(() => {
    if (isAuthenticated && Array.isArray(user?.wishlist)) {
      setWishlist(user.wishlist as Product[]);
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  /* ------------------ Sync to server ------------------ */

  const syncWishlistToServer = async (updatedWishlist: Product[]) => {
    if (!user?.id) return;

    try {
      await api.patch(`/users/${user.id}`, {
        wishlist: updatedWishlist,
        updatedAt: new Date().toISOString(),
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, wishlist: updatedWishlist })
      );
    } catch (error) {
      console.error("Failed to sync wishlist:", error);
    }
  };

  /* ------------------ Actions ------------------ */

  const toggleWishlist: WishlistContextType["toggleWishlist"] = async (
    product
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    setLoading(true);

    try {
      const exists = wishlist.some((item) => item.id === product.id);

      const updatedWishlist = exists
        ? wishlist.filter((item) => item.id !== product.id)
        : [...wishlist, product];

      setWishlist(updatedWishlist);
      await syncWishlistToServer(updatedWishlist);

      toast.success(
        exists
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`
      );
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Error updating wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist: WishlistContextType["removeFromWishlist"] = async (
    id
  ) => {
    if (!isAuthenticated) return;

    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
    await syncWishlistToServer(updatedWishlist);
  };

  const clearWishlist: WishlistContextType["clearWishlist"] = async () => {
    if (!isAuthenticated) return;

    setWishlist([]);
    await syncWishlistToServer([]);
  };

  /* ------------------ Helpers ------------------ */

  const isInWishlist = (id: string) =>
    wishlist.some((item) => item.id === id);

  const wishlistCount = wishlist.length;

  const value: WishlistContextType = {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    wishlistCount,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

/* ------------------ Hook ------------------ */

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
