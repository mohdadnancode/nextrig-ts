import { Fragment, useEffect, useState } from "react";
import api from "../../api/client";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { AdminOrder, AdminOrderStatus } from "../admin.types";
import type { User } from "../../types/user";

const statusOptions: AdminOrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles: Record<AdminOrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  shipped: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const Orders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [nextStatus, setNextStatus] = useState<AdminOrderStatus>("pending");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  // FETCH ALL USER ORDERS
  const fetchOrders = async () => {
    try {
      const res = await api.get<User[]>("/users");
      const users = res.data;

      const allOrders: AdminOrder[] = users.flatMap((user) =>
        (user.orders ?? []).map((order) => ({
          ...order,
          userId: user.id,
          customerName: user.username,
          customerEmail: user.email,
          paymentMethod: order.paymentMethod || "UPI",
        })),
      );

      allOrders.sort(
        (a: AdminOrder, b: AdminOrder) =>
          new Date(b.date || b.createdAt || 0).getTime() -
          new Date(a.date || a.createdAt || 0).getTime(),
      );
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...orders];

    // STATUS FILTER
    if (statusFilter !== "all") {
      result = result.filter(
        (o) => o.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // SEARCH (ORDER ID / EMAIL)
    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (o) =>
          o.id?.toString().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q),
      );
    }

    // SORT
    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);

      return sortBy === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredOrders(result);
  }, [orders, sortBy, statusFilter, search]);

  // HELPERS
  const getOrderTotal = (order: AdminOrder): number => {
    return order.totalAmount;
  };

  const toggleDetails = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  // STATUS UPDATE
  const requestStatusChange = (order: AdminOrder, status: string) => {
    setSelectedOrder(order);
    setNextStatus(status.toLowerCase() as AdminOrderStatus);
    setConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder) return;

    try {
      const res = await api.get(`/users/${selectedOrder.userId}`);
      const user: { id: string; orders: AdminOrder[] } = res.data;

      const updatedOrders = user.orders.map((o: AdminOrder) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              status: nextStatus,
              ...(nextStatus === "cancelled"
                ? {
                    cancelledBy: "admin",
                    cancelledAt: new Date().toISOString(),
                  }
                : {}),
            }
          : o,
      );
      await api.patch(`/users/${user.id}`, { orders: updatedOrders });

      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setConfirmOpen(false);
      setSelectedOrder(null);
      setNextStatus("pending");
    }
  };

  const getStatusCount = (status: AdminOrderStatus) =>
    orders.filter((o) => o.status?.toLowerCase() === status).length;

  if (loading) {
    return <p className="text-gray-400">Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>
          Total: <b className="text-white">{orders.length}</b>
        </span>
        <span>
          Pending:{" "}
          <b className="text-yellow-400">{getStatusCount("pending")}</b>
        </span>
        <span>
          Shipped: <b className="text-blue-400">{getStatusCount("shipped")}</b>
        </span>
        <span>
          Delivered:{" "}
          <b className="text-green-400">{getStatusCount("delivered")}</b>
        </span>
        <span>
          Cancelled:{" "}
          <b className="text-red-400">{getStatusCount("cancelled")}</b>
        </span>
      </div>

      {/* Filters */}
      <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black border border-white/20 rounded px-3 py-2 text-white w-full sm:w-64 focus:border-[#76b900]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-black border border-white/20 rounded px-3 py-2 text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black border border-white/20 rounded px-3 py-2 text-white capitalize"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setSortBy("newest");
            setStatusFilter("all");
          }}
          className="border border-white/20 px-4 py-2 rounded text-gray-300 hover:text-[#76b900]"
        >
          Clear Filters
        </button>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-gray-400">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <Fragment key={o.id}>
                <tr
                  key={o.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-3 font-medium">#{o.id}</td>

                  <td className="p-3">
                    {o.customerName}
                    <p className="text-xs text-gray-500">{o.customerEmail}</p>
                  </td>

                  <td className="p-3 capitalize">{o.paymentMethod}</td>

                  <td className="p-3">
                    {new Date(o.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3 font-semibold text-[#76b900]">
                    ₹{getOrderTotal(o)?.toLocaleString("en-IN")}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <select
                        value={o.status}
                        disabled={o.status === "cancelled"}
                        onChange={(e) => requestStatusChange(o, e.target.value)}
                        className={`px-2 py-1 rounded border bg-black ${
                          statusStyles[o.status]
                        } ${o.status === "cancelled" ? "opacity-60" : ""}`}
                      >
                        {statusOptions.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-black text-white"
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>

                      {o.status === "cancelled" && (
                        <span className="text-xs text-red-400">
                          Cancelled by {o.cancelledBy || "unknown"}
                        </span>
                      )}
                      {o.cancelledAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(o.cancelledAt).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleDetails(o.id)}
                      className="text-[#76b900] hover:underline"
                    >
                      {expandedOrder === o.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* DETAILS */}
                {expandedOrder === o.id && (
                  <tr className="bg-black/40">
                    <td colSpan={7} className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h3 className="font-semibold mb-3">Order Items</h3>
                          <div className="space-y-2">
                            {o.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between border-b border-white/10 pb-2"
                              >
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span>
                                  ₹
                                  {(item.price * item.quantity).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <h3 className="font-semibold mb-3">
                            Shipping Address
                          </h3>
                          {o.shippingAddress ? (
                            <div className="text-sm text-gray-300 space-y-1">
                              <p>{o.shippingAddress.fullName}</p>
                              <p>{o.shippingAddress.address}</p>
                              <p>
                                {o.shippingAddress.city} –{" "}
                                {o.shippingAddress.pincode}
                              </p>
                              <p>Mobile: {o.shippingAddress.mobileNumber}</p>
                            </div>
                          ) : (
                            <p className="text-gray-400">No address found</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  MOBILE */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((o) => (
          <div
            key={o.id}
            className="bg-[#0b0b0b] border border-white/10 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">#{o.id}</p>
              <span
                className={`text-xs px-2 py-1 rounded border ${
                  statusStyles[o.status]
                }`}
              >
                {o.status}
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-1">{o.customerEmail}</p>

            <div className="mt-3 text-sm space-y-1">
              <p>Items: {o.items?.length || 0}</p>
              <p>Date: {new Date(o.date).toLocaleDateString()}</p>
              <p className="font-medium">
                ₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}
              </p>
              <p className="capitalize">Payment: {o.paymentMethod || "UPI"}</p>
            </div>

            <select
              value={o.status}
              disabled={o.status === "cancelled"}
              onChange={(e) => requestStatusChange(o, e.target.value)}
              className={`mt-4 w-full bg-black border border-white/20 rounded px-3 py-2 text-white ${
                o.status === "cancelled" ? "opacity-50" : "cursor-pointer"
              }`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {o.status === "cancelled" && (
              <p className="text-xs text-red-400 mt-1">
                Cancelled by {o.cancelledBy || "unknown"}
              </p>
            )}
            {o.cancelledAt && (
              <span className="text-xs text-gray-500">
                {new Date(o.cancelledAt).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-400">No orders found</p>
        )}
      </div>

      {/*  CONFIRM  */}
      <ConfirmModal
        open={confirmOpen}
        title="Change order status?"
        message={`Change status to "${nextStatus}"?`}
        confirmText="Update"
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Orders;
