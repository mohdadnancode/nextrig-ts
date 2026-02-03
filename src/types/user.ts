export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profileImage: string;
  address: unknown[];
  cart: unknown[];
  orders: unknown[];
  wishlist: unknown[];
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
};
