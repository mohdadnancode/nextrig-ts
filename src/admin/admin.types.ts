import type { Order, OrderStatus } from "../types/order";

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

export type AdminOrder = Order & {
  createdAt?: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
};

export type AdminOrderStatus = OrderStatus;
