import { useEffect, useState } from "react";
import api from "../../api/client";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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

/* ────── Types ────── */

type DashboardData = {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  recentOrders: RecentOrder[];
  revenueChart: { date: string; revenue: number }[];
  ordersChart: { date: string; orders: number }[];
  statusCounts: {
    pending: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
};

type RecentOrder = {
  _id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
};

type RangeType = "overall" | "365D" | "30D" | "7D" | "1D";

const RANGE_LABELS = {
  "30D": "Last 30 Days",
  "7D": "Last 7 Days",
  "1D": "Today",
  "365D": "Last Year",
  overall: "All Time",
};

/* ────── Stat Card ────── */

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
};

const StatCard = ({ title, value, icon: Icon, accent }: StatCardProps) => (
  <div className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl p-5 flex items-center justify-between group hover:border-primary/25 transition-colors">
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent ?? "bg-primary/10 text-primary"}`}
    >
      <Icon size={20} />
    </div>
  </div>
);

/* ────── Status Badge ────── */

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { bg: string; text: string; icon: typeof Clock }
  > = {
    pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", icon: Clock },
    shipped: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Truck },
    delivered: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      icon: CheckCircle2,
    },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle },
  };
  const c = config[status] ?? config.pending;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${c.bg} ${c.text}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
};

/* ────── Tooltip Styles ────── */

const chartTooltipStyle = {
  contentStyle: {
    background: "#111",
    border: "1px solid rgba(118,185,0,0.2)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#ccc",
  },
};

/* ────── Dashboard Component ────── */

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [range, setRange] = useState<RangeType>("30D");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<DashboardData>("/admin/dashboard", {
          params: { range},
        });

        setData(res.data);
      } catch (err: unknown) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-red-400">{error || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Users" value={data.users} icon={Users} />
        <StatCard title="Products" value={data.products} icon={Package} />
        <StatCard
          title="Paid Orders"
          value={data.orders}
          icon={ShoppingCart}
          accent="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          title="Revenue"
          value={`₹${data.revenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          accent="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* ── Status Breakdown ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            {
              label: "Pending",
              count: data.statusCounts.pending,
              color: "text-yellow-400",
              icon: Clock,
            },
            {
              label: "Shipped",
              count: data.statusCounts.shipped,
              color: "text-blue-400",
              icon: Truck,
            },
            {
              label: "Delivered",
              count: data.statusCounts.delivered,
              color: "text-green-400",
              icon: CheckCircle2,
            },
            {
              label: "Cancelled",
              count: data.statusCounts.cancelled,
              color: "text-red-400",
              icon: XCircle,
            },
          ] as const
        ).map(({ label, count, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#0b0b0b] border border-white/[0.07] rounded-lg px-4 py-3 flex items-center gap-3"
          >
            <Icon size={16} className={color} />
            <div>
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["overall", "365D", "30D", "7D", "1D"] as RangeType[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 text-xs rounded ${
              range === r
                ? "bg-primary text-black"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">
            Revenue ({RANGE_LABELS[range]})
          </h2>
          <div className="w-full h-[300px]">
            {data.revenueChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#555"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    {...chartTooltipStyle}
                    formatter={(value: unknown) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Revenue",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#76b900"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#76b900" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                No data for selected range
              </div>
            )}
          </div>
        </div>

        {/* Orders per day */}
        <div className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">
            Paid Orders
          </h2>
          <div className="w-full h-[300px]">
            {data.ordersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ordersChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#555"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    {...chartTooltipStyle}
                    formatter={(value: unknown) => [Number(value), "Orders"]}
                  />
                  <Bar dataKey="orders" fill="#76b900" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                No order data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h2 className="text-sm font-semibold text-gray-300">Recent Orders</h2>
        </div>

        {data.recentOrders.length === 0 ? (
          <p className="p-5 text-gray-500 text-sm">No orders yet</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {data.recentOrders.map((o) => (
              <div
                key={o._id}
                className={`px-5 py-3.5 flex items-center gap-4 ${
                  !o.isPaid ? "opacity-60 blur-[0.2px]" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {o.customerName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {o.itemCount} item{o.itemCount !== 1 ? "s" : ""} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={o.status} />

                  <span
                    className={`text-[10px] font-medium ${
                      o.isPaid ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {o.isPaid
                      ? "Paid"
                      : o.paymentMethod === "cod"
                        ? "COD"
                        : "Pending Payment"}
                  </span>
                </div>

                <p className="text-sm font-semibold text-primary tabular-nums w-24 text-right">
                  ₹{o.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
