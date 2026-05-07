import { Fragment, useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { AdminOrder, AdminOrderStatus } from "../admin.types";

const statusFlow: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  pending: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const statusStyles: Record<AdminOrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  shipped: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const Orders = () => {
  // State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Status change confirmation
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [nextStatus, setNextStatus] = useState<AdminOrderStatus>("pending");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [total, setTotal] = useState(0);

  // Fetch Orders from Backend
  const fetchOrders = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);

        const res = await api.get(`/admin/orders`, {
          params: {
            page: pageNum,
            limit: 5,
            search: search.replace("#", "").trim(),
            status: statusFilter,
            sort: sortBy,
          },
        });

        setOrders(res.data.orders);
        setPage(res.data.page);
        setPages(res.data.pages);
        setTotal(res.data.total);
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, sortBy],
  );

  useEffect(() => {
    fetchOrders(page);
  }, [page, search, statusFilter, sortBy, fetchOrders]);

  // Helpers
  const toggleDetails = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusCount = (status: AdminOrderStatus) =>
    orders.filter((o) => o.status === status).length;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Status Update
  const requestStatusChange = (order: AdminOrder, status: AdminOrderStatus) => {
    if (status === order.status) return;
    setSelectedOrder(order);
    setNextStatus(status as AdminOrderStatus);
    setConfirmOpen(true);
  };
  const confirmStatusChange = async () => {
    if (!selectedOrder) return;

    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        status: nextStatus,
      });
      toast.success(`Order status updated to "${nextStatus}"`);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id
            ? {
                ...o,
                status: nextStatus,
                ...(nextStatus === "cancelled"
                  ? {
                      cancelledBy: "admin" as const,
                      cancelledAt: new Date().toISOString(),
                    }
                  : {}),
              }
            : o,
        ),
      );
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setConfirmOpen(false);
      setSelectedOrder(null);
    }
  };

  // Page generator functions
  const getPageNumbers = () => {
    const result: (number | "...")[] = [];

    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) result.push(i);
      return result;
    }

    result.push(1);

    if (page > 3) result.push("...");

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < pages) result.push(i);
    }

    if (page < pages - 2) result.push("...");

    result.push(pages);

    return result;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {/* Status summary bar */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>
          Total: <b className="text-white">{total}</b>
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
      <div className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            placeholder="Search by ID, name, or email"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
              }
            }}
            className="bg-black border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary w-full sm:w-[260px]"
          />

          <button
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="px-4 py-2 bg-primary text-black rounded hover:opacity-90"
          >
            Search
          </button>
        </div>
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
            setPage(1);
            fetchOrders(1);
          }}
        >
          Clear
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-[#0b0b0b] border border-white/[0.07] rounded-xl overflow-x-auto">
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
            {orders.map((o) => {
              const itemsTotal =
                o.itemsTotal ??
                o.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

              const shipping = o.shippingCharge ?? 0;
              const cod = o.codFee ?? 0;

              const total = o.totalAmount ?? itemsTotal + shipping + cod;

              return (
                <Fragment key={o._id}>
                  <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    {/* Order ID — show last 8 chars for readability */}
                    <td className="p-3 font-medium font-mono text-xs">
                      #{o.orderNumber}
                    </td>

                    {/* Customer info — from the populated user object */}
                    <td className="p-3">
                      {o.user?.username ?? "Unknown"}
                      <p className="text-xs text-gray-500">
                        {o.user?.email ?? ""}
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="capitalize text-gray-300">
                          {o.paymentMethod}
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md w-fit ${
                            o.isPaid
                              ? "bg-green-500/10 text-green-400 border border-green-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {o.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-gray-400">
                      {formatDate(o.createdAt)}
                    </td>

                    <td className="p-3 font-semibold text-primary tabular-nums">
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </td>

                    {/* Status dropdown */}
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <select
                          value={o.status}
                          disabled={statusFlow[o.status].length === 0}
                          onChange={(e) =>
                            requestStatusChange(
                              o,
                              e.target.value as AdminOrderStatus,
                            )
                          }
                          className={`px-2 py-1 rounded border text-xs font-medium bg-black transition ${
                            statusStyles[o.status]
                          } ${
                            statusFlow[o.status].length === 0
                              ? "opacity-60 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          {/* current status */}
                          <option value={o.status}>
                            {o.status.charAt(0).toUpperCase() +
                              o.status.slice(1)}
                          </option>

                          {statusFlow[o.status].map((next) => (
                            <option key={next} value={next}>
                              {next.charAt(0).toUpperCase() + next.slice(1)}
                            </option>
                          ))}
                        </select>

                        {/* EXPIRES SOON */}
                        {o.status === "pending" &&
                          !o.isPaid &&
                          o.paymentMethod !== "cod" &&
                          o.expiresAt &&
                          new Date(o.expiresAt).getTime() > Date.now() && (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded w-fit">
                              ⏳ Expires Soon
                            </span>
                          )}

                        {/* EXPIRED */}
                        {o.status === "pending" &&
                          !o.isPaid &&
                          o.paymentMethod !== "cod" &&
                          o.expiresAt &&
                          new Date(o.expiresAt).getTime() <= Date.now() && (
                            <span className="text-[10px] text-red-400">
                              Payment expired
                            </span>
                          )}

                        {o.status === "cancelled" && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-red-400">
                              by {o.cancelledBy ?? "unknown"}
                            </span>

                            {o.cancelledBy === "system" && (
                              <span className="text-[10px] text-red-500 font-medium">
                                ⚠ Auto-cancelled
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => toggleDetails(o._id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {expandedOrder === o._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded order details */}
                  {expandedOrder === o._id && (
                    <tr className="bg-black/30">
                      <td colSpan={7} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Items */}
                          <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                              Order Items
                            </h3>
                            <div className="space-y-2">
                              {o.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 border-b border-white/5 pb-2 last:border-0"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 rounded bg-white/5 object-contain p-1"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-200 truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <span className="text-sm text-primary font-medium tabular-nums">
                                    ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 space-y-1 text-sm text-gray-400">
                              <div className="flex justify-between">
                                <span>Items Total</span>
                                <span>
                                  ₹{itemsTotal.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                  {shipping === 0 ? "Free" : `₹${shipping}`}
                                </span>
                              </div>

                              {cod > 0 && (
                                <div className="flex justify-between">
                                  <span>COD Fee</span>
                                  <span>₹{cod}</span>
                                </div>
                              )}

                              <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span>₹{total.toLocaleString("en-IN")}</span>
                              </div>
                              {o.expiresAt && o.status === "pending" && (
                                <p className="text-sm text-yellow-400 mt-2">
                                  Expires at:{" "}
                                  {new Date(o.expiresAt).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Shipping address */}
                          <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                              Shipping Address
                            </h3>
                            {o.shippingAddress ? (
                              <div className="text-sm text-gray-300 space-y-1 bg-white/[0.02] rounded-lg p-3 border border-white/5">
                                <p className="font-medium text-white">
                                  {o.shippingAddress.fullName}
                                </p>
                                <p>{o.shippingAddress.address}</p>
                                <p>
                                  {o.shippingAddress.city} –{" "}
                                  {o.shippingAddress.pincode}
                                </p>
                                <p className="text-gray-500">
                                  Mobile: {o.shippingAddress.mobileNumber}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-500">No address found</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-[#0b0b0b] border border-white/[0.07] rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium font-mono text-xs">#{o.orderNumber}</p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md border font-medium capitalize ${statusStyles[o.status]}`}
              >
                {o.status}
              </span>
            </div>

            <p className="text-sm text-gray-200 mt-2">
              {o.user?.username ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-500">{o.user?.email ?? ""}</p>

            <div className="mt-3 text-sm space-y-1 text-gray-400">
              <p>Items: {o.items?.length || 0}</p>
              <p>Date: {formatDate(o.createdAt)}</p>
              <p className="font-semibold text-primary">
                ₹{total?.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-2">
                <span className="capitalize text-gray-300">
                  {o.paymentMethod}
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md ${
                    o.isPaid
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {o.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>

            <select
              value={o.status}
              disabled={statusFlow[o.status].length === 0}
              onChange={(e) =>
                requestStatusChange(o, e.target.value as AdminOrderStatus)
              }
              className={`mt-4 w-full bg-black border border-white/20 rounded px-3 py-2 text-white text-sm ${
                statusFlow[o.status].length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <option value={o.status}>
                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
              </option>

              {statusFlow[o.status].map((next) => (
                <option key={next} value={next}>
                  {next.charAt(0).toUpperCase() + next.slice(1)}
                </option>
              ))}
            </select>

            {o.status === "cancelled" && (
              <div className="mt-1">
                <p className="text-[10px] text-red-400">
                  Cancelled by {o.cancelledBy ?? "unknown"}
                </p>

                {o.cancelledBy === "system" && (
                  <p className="text-[10px] text-red-500">⚠ Auto-cancelled</p>
                )}
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found</p>
        )}
      </div>

      {pages > 1 && (
        <div className="relative mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-white/20 text-sm disabled:opacity-40 hover:border-primary transition"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}-${i}`}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded text-sm transition ${
                    p === page
                      ? "bg-primary text-black"
                      : "border border-white/20 hover:border-primary"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded border border-white/20 text-sm disabled:opacity-40 hover:border-primary transition"
            >
              Next
            </button>
          </div>

          {/* Right side button */}
          <div className="absolute right-0">{/* your other button */}</div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title="Change order status?"
        message={`Update this order to "${nextStatus}"?`}
        confirmText="Update"
        danger={nextStatus === "cancelled"}
        onConfirm={confirmStatusChange}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Orders;
