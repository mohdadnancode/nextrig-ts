import type { OrderStatus } from "../types/order";

export type AdminDashboardStats = {
  users: number;
  products: number;
  orders: number;
  revenue: string;
};

export type RevenueChartPoint = {
  date: string;
  revenue: number;
};

export type OrdersChartPoint = {
  date: string;
  orders: number;
};

/* ── Order types for admin pages ── */

export type AdminOrderItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

export type AdminShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  mobileNumber: string;
};

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  user?: { _id: string; username: string; email: string };

  items: AdminOrderItem[];

  itemsTotal?: number;
  shippingCharge?: number;
  codFee?: number;
  totalAmount?: number;

  status: OrderStatus;
  paymentMethod: string;
  paymentDetails?: Record<string, unknown>;

  expiresAt?: string;

  isPaid: boolean;
  paidAt?: string;

  shippingAddress: AdminShippingAddress;

  createdAt: string;
  updatedAt: string;

  cancelledBy?: "user" | "admin" | "system";
  cancelledAt?: string;
};

export type AdminOrderStatus = OrderStatus;
