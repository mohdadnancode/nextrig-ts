import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingBag,
  Lock,
} from "lucide-react";
import api from "../../api/client";
import type { Order, OrderStatus } from "../../types/order";

const MyOrders: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  type StatusFilter = OrderStatus | "all";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  /* ---------------- Fetch Orders ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) return;

      setLoading(true);
      try {
        const res = await api.get(`/users/${user.id}`);
        const userOrders: Order[] = res.data?.orders || [];

        setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.id]);

  /* ---------------- Filter + Sort ---------------- */
  useEffect(() => {
    let result: Order[] = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(result);
  }, [orders, sortBy, statusFilter]);

  /* ---------------- Helpers ---------------- */
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const cancelOrder = async (userId: string, orderId: string) => {
    try {
      const res = await api.get(`/users/${userId}`);
      const userData = res.data;

      const updatedOrders: Order[] = userData.orders.map((order: Order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled",
              cancelledBy: "user",
              cancelledAt: new Date().toISOString(),
            }
          : order,
      );

      await api.patch(`/users/${userId}`, { orders: updatedOrders });
      setOrders(updatedOrders);
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Something went wrong while cancelling the order.");
    }
  };

  const getStatusIcon = (status?: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={18} className="text-yellow-500" />;
      case "shipped":
        return <Truck size={18} className="text-blue-500" />;
      case "delivered":
        return <CheckCircle2 size={18} className="text-green-500" />;
      case "cancelled":
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <Loader2 size={18} className="text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (status?: OrderStatus): string => {
    switch (status) {
      case "pending":
        return "Pending";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Processing";
    }
  };

  const getStatusCount = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  /* ---------------- Loading / Auth ---------------- */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-primary text-xl">Loading your orders...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Lock className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-semibold mb-4">
            Please log in to view your orders
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#76b900] text-black font-medium px-6 py-3"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- JSX (UNCHANGED) ---------------- */
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            My Orders
          </h1>
          <p className="text-gray-400 text-lg">
            Track and manage your purchases
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <ShoppingBag size={16} className="text-primary" /> Total:
                <span className="font-semibold text-white">
                  {orders.length}
                </span>
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <Clock size={16} className="text-yellow-500" /> Pending:
                <span className="text-yellow-400 font-semibold">
                  {getStatusCount("pending")}
                </span>
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <Truck size={16} className="text-blue-400" /> Shipped:
                <span className="text-blue-400 font-semibold">
                  {getStatusCount("shipped")}
                </span>
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 size={16} className="text-green-500" /> Delivered:
                <span className="text-green-400 font-semibold">
                  {getStatusCount("delivered")}
                </span>
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <XCircle size={16} className="text-red-500" /> Cancelled:
                <span className="text-red-400 font-semibold">
                  {getStatusCount("cancelled")}
                </span>
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#76b900]"
              >
                <option value="newest" className="text-black">
                  Newest First
                </option>
                <option value="oldest" className="text-black">
                  Oldest First
                </option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#76b900]"
              >
                <option value="all" className="text-black">
                  All Orders
                </option>
                <option value="pending" className="text-black">
                  Pending
                </option>
                <option value="shipped" className="text-black">
                  Shipped
                </option>
                <option value="delivered" className="text-black">
                  Delivered
                </option>
                <option value="cancelled" className="text-black">
                  Cancelled
                </option>
              </select>
              <button
                onClick={() => {
                  setSortBy("newest");
                  setStatusFilter("all");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={60} />
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              No orders yet
            </h3>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg bg-[#76b900] text-black font-medium px-6 py-3 hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#76b900]/30 ${
                order.status === "cancelled" ? "opacity-60" : ""
              }`}
            >
              {/* Summary */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="font-semibold text-white">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date</p>
                  <p className="font-medium text-white">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total</p>
                  <p className="font-semibold text-primary">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium text-white">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="bg-[#76b900] hover:bg-[#68a500] text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_#76b900] hover:scale-105 flex items-center gap-2"
                  >
                    {expandedOrder === order.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-white/10 bg-black/20 p-6 animate-fadeIn">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="h-1 bg-gray-700 rounded-full">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ${
                          order.status === "pending"
                            ? "w-1/3 bg-yellow-500"
                            : order.status === "shipped"
                              ? "w-2/3 bg-blue-500"
                              : order.status === "delivered"
                                ? "w-full bg-green-500"
                                : "w-0 bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Pending</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                className="w-12 h-12 object-contain rounded bg-gray-800 p-1"
                              />
                              <div>
                                <p className="font-medium text-white">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-primary font-semibold">
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-3">
                          Delivery Address
                        </h3>
                        {order.shippingAddress ? (
                          <div className="bg-white/5 rounded-lg p-4">
                            <p className="font-medium text-white">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {order.shippingAddress.address}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {order.shippingAddress.city} -{" "}
                              {order.shippingAddress.pincode}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Mobile: {order.shippingAddress.mobileNumber}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400">No address found</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary mb-2">
                            Payment
                          </h3>
                          <p className="text-white capitalize">
                            {order.paymentMethod || "UPI"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary mb-2">
                            Status
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium text-white capitalize">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xl font-bold">Order Total:</span>
                    <span className="text-primary text-xl font-bold">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Cancel Order Button */}
                  <div className="mt-4 flex justify-end">
                    {order.status?.toLowerCase() === "pending" ? (
                      <button
                        onClick={() => cancelOrder(user.id, order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_#ff4444]"
                      >
                        Cancel Order
                      </button>
                    ) : order.status?.toLowerCase() === "shipped" ? (
                      <button
                        disabled
                        className="bg-gray-700 text-gray-400 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                        title="You can't cancel after shipping"
                      >
                        Order Shipped
                      </button>
                    ) : order.status?.toLowerCase() === "delivered" ? (
                      <button
                        disabled
                        className="bg-gray-700 text-gray-400 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                        title="Delivered orders cannot be cancelled"
                      >
                        Delivered
                      </button>
                    ) : order.status?.toLowerCase() === "cancelled" ? (
                      <span className="text-red-400 font-semibold">
                        Order Cancelled
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
