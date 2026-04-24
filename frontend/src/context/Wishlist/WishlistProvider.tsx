import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Auth/useAuth";
import { WishlistContext } from "./WishlistContext";
import type { WishlistContextType } from "../context.types";
import type { Product } from "../../types/product";

import {
  getWishlistAPI,
  toggleWishlistAPI,
  clearWishlistAPI,
} from "../../services/wishlistService";

type Props = { children: ReactNode };

export const WishlistProvider = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH
  const fetchWishlist = async () => {
    try {
      const res = await getWishlistAPI();
      setWishlist(res.data);
    } catch (err) {
      console.error("Wishlist fetch failed", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
    else setWishlist([]);
  }, [isAuthenticated]);

  // TOGGLE
  const toggleWishlist: WishlistContextType["toggleWishlist"] = async (
    product,
  ) => {
    if (!isAuthenticated) {
      toast.error("Login first");
      return;
    }

    setLoading(true);

    const exists = wishlist.some((i) => i._id === product._id);

    let updatedWishlist: Product[];

    if (exists) {
      updatedWishlist = wishlist.filter((i) => i._id !== product._id);
    } else {
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);

    try {
      await toggleWishlistAPI(product._id);

      toast.success(
        exists ? `${product.name} removed` : `${product.name} added`,
      );
    } catch (err) {
      console.error(err);
      setWishlist(wishlist);

      toast.error("Wishlist failed (rollback)");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE
  const removeFromWishlist = async (id: string) => {
    const prev = wishlist;

    setWishlist((prevList) => prevList.filter((item) => item._id !== id));

    try {
      await toggleWishlistAPI(id);
    } catch (err) {
      console.error(err);
      setWishlist(prev); // rollback
    }
  };

  // CLEAR
  const clearWishlist = async () => {
    const prev = wishlist;

    setWishlist([]);

    try {
      await clearWishlistAPI();
    } catch (err) {
      console.error(err);
      setWishlist(prev); // rollback
    }
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item._id === id);

  const value: WishlistContextType = {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    wishlistCount: wishlist.length,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
