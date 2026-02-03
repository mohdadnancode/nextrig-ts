import type { Order } from "./order";
import type { Product } from "./product";

export type Address = {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  mobileNumber: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profileImage: string;

  address: Address | null;
  cart: Product[];
  orders: Order[];
  wishlist: Product[];

  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
};
