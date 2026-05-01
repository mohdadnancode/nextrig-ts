import type { Address } from "./address";

export type AdminUser = {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";

  profileImage?: {
    url: string;
    public_id: string;
  };

  addresses: Address[];

  isVerified: boolean;
  isBlocked: boolean;

  orderCount: number;
  totalSpent: number;

  createdAt: string;
  updatedAt: string;
};
