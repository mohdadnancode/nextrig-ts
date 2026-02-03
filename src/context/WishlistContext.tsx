import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

import { useAuth } from "./AuthContext";
import type { WishlistItem } from "../types/wishlist";
import type { WishlistContextType } from "./context.types";

/* ------------------ Context ------------------ */

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

/* ------------------ Provider Props ------------------ */

type WishlistProviderProps = {
  children: ReactNode;
};

/* ------------------ Provider ------------------ */

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const { user, isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ Sync from auth ------------------ */

  useEffect(() => {
    if (isAuthenticated && Array.isArray(user?.wishlist)) {
      setWishlist(user.wishlist as WishlistItem[]);
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  /* ------------------ Sync to server ------------------ */

  const syncWishlistToServer = async (
    updatedWishlist: WishlistItem[],
  ): Promise<void> => {
    if (!user?.id) return;

    try {
      await api.patch(`/users/${user.id}`, {
        wishlist: updatedWishlist,
        updatedAt: new Date().toISOString(),
      });

      const updatedUser = { ...user, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to sync wishlist:", error);
    }
  };

  /* ------------------ Actions ------------------ */

  const toggleWishlist: WishlistContextType["toggleWishlist"] = async (
    product,
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    setLoading(true);

    try {
      const exists = wishlist.some((item) => item.id === product.id);
      let updatedWishlist: WishlistItem[];

      if (exists) {
        updatedWishlist = wishlist.filter((item) => item.id !== product.id);
        toast.success(`${product.name} removed from wishlist`);
      } else {
        updatedWishlist = [...wishlist, product];
        toast.success(`${product.name} added to wishlist`);
      }

      setWishlist(updatedWishlist);
      await syncWishlistToServer(updatedWishlist);
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Error updating wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist: WishlistContextType["removeFromWishlist"] = async (
    id,
  ) => {
    if (!isAuthenticated) return;

    const removedItem = wishlist.find((item) => item.id === id);
    const updatedWishlist = wishlist.filter((item) => item.id !== id);

    setWishlist(updatedWishlist);
    await syncWishlistToServer(updatedWishlist);

    if (removedItem) {
      toast.success(`${removedItem.name} removed from wishlist`);
    } else {
      toast("Item removed from wishlist");
    }
  };

  const clearWishlist: WishlistContextType["clearWishlist"] = async () => {
    if (!isAuthenticated) return;

    setWishlist([]);
    await syncWishlistToServer([]);
  };

  /* ------------------ Helpers ------------------ */

  const isInWishlist = (id: string): boolean =>
    wishlist.some((item) => item.id === id);

  const wishlistCount = wishlist.length;

  /* ------------------ Provider ------------------ */

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
