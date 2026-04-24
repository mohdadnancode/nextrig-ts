import { createContext } from "react";
import type { WishlistContextType } from "../context.types";

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);
