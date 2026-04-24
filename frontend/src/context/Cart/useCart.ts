import { useContext } from "react";
import { CartContext } from "./CartContext";
import type { CartContextType } from "../context.types";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};