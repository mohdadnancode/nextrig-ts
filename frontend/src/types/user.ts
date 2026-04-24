import type { Address } from "./address";
import type { CartItem } from "./cart";
import type { Order } from "./order";
import type { Product } from "./product";

export type User = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";

  profileImage?: {
    url: string;
    public_id: string;
  };

  addresses: Address[];
  cart: CartItem[];
  orders: Order[];
  wishlist: Product[];

  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};
