import { createContext } from "react";
import type { CartContextType } from "../context.types";

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
