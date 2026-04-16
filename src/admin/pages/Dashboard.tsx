import { useEffect, useState, useMemo } from "react";
import api from "../../api/client";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import type {
  AdminOrder,
  AdminDashboardStats,
  RevenueChartPoint,
  OrdersChartPoint,
} from "../admin.types";
import type { User } from "../../types/user";

// STAT CARD
type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => (
  <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <Icon className="text-primary" />
  </div>
);
// HELPERS
const getOrderAmount = (order: AdminOrder): number =>
  Number(order.totalAmount ?? 0);

const isValidOrder = (order: AdminOrder): boolean =>
  order.status?.toLowerCase() !== "cancelled";

const getOrderDateKey = (order: AdminOrder): string => {
  const d = order.date ?? order.createdAt;
  return d ? new Date(d).toLocaleDateString() : "Unknown";
};

const Dashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    users: 0,
    products: 0,
    orders: 0,
    revenue: "₹0",
  });

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);

  // LOAD DATA
  const loadDashboard = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get<User[]>("/users"),
        api.get("/products"),
      ]);

      const users = usersRes.data;
      const products = productsRes.data;

      const allOrders: AdminOrder[] = users.flatMap((u) => u.orders ?? []);

      const validOrders = allOrders.filter(isValidOrder);

      const revenue = validOrders.reduce(
        (sum, o) => sum + getOrderAmount(o),
        0,
      );

      setStats({
        users: users.length,
        products: products.length,
        orders: allOrders.length,
        revenue: `₹${revenue.toLocaleString("en-IN")}`,
      });

      setOrders(validOrders);

      setRecentOrders(
        [...allOrders]
          .sort(
            (a, b) =>
              new Date(b.date || b.createdAt || 0).getTime() -
              new Date(a.date || a.createdAt || 0).getTime(),
          )
          .slice(0, 5),
      );
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // CHART DATA
  // Revenue per day (non-cancelled)
  const revenueChartData = useMemo<RevenueChartPoint[]>(() => {
    const map: Record<string, number> = {};

    orders.forEach((o) => {
      const key = getOrderDateKey(o);
      map[key] = (map[key] || 0) + getOrderAmount(o);
    });

    return Object.entries(map).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [orders]);

  // Orders count per day (non-cancelled)
  const ordersChartData = useMemo<OrdersChartPoint[]>(() => {
    const map: Record<string, number> = {};

    orders.forEach((o) => {
      const key = getOrderDateKey(o);
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([date, orders]) => ({
      date,
      orders,
    }));
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Users" value={stats.users} icon={Users} />
        <StatCard title="Products" value={stats.products} icon={Package} />
        <StatCard title="Orders" value={stats.orders} icon={ShoppingCart} />
        <StatCard title="Revenue" value={stats.revenue} icon={IndianRupee} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4">
          <h2 className="mb-4 font-semibold">Revenue Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#76b900"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4">
          <h2 className="mb-4 font-semibold">Orders Per Day</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="orders" fill="#76b900" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl">
        <div className="p-4 border-b border-[#76b900]/20">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>

        <div className="divide-y divide-white/5">
          {recentOrders.length === 0 && (
            <p className="p-4 text-gray-400">No orders yet</p>
          )}

          {recentOrders.map((o) => (
            <div key={o.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">#{o.id}</p>
                <p className="text-sm text-gray-400">
                  {o.date || o.createdAt
                    ? new Date(o.date ?? o.createdAt).toLocaleDateString(
                        "en-IN",
                      )
                    : "—"}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded capitalize ${
                  o.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : o.status === "shipped"
                      ? "bg-blue-500/20 text-blue-400"
                      : o.status === "delivered"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                }`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
