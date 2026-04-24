import { useContext } from "react";
import { WishlistContext } from "./WishlistContext";
import type { WishlistContextType } from "../context.types";


export const useWishlist = ():WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within provider");
  return ctx;
};
