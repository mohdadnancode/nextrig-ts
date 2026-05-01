import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/Cart/useCart";
import { useCartControls } from "../../context/useCartControls";
import type { CartItem } from "../../types/cart";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";


// ─────────────────────────────────────────────
// Cart Row — separate component (fixes hooks-in-loop violation)
// ─────────────────────────────────────────────
const CartRow = ({ item }: { item: CartItem }) => {
  const navigate = useNavigate();
  const { increase, decrease, remove, canDecrease, canIncrease, loading } =
    useCartControls(item._id, item.quantity, item.countInStock);

  const imageUrl =
    item.image ||
    getImageUrl((item as unknown as { images?: (string | { url: string; public_id: string })[] }).images?.[0]);

  const itemTotal = (item.price ?? 0) * item.quantity;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/20 transition-colors">

      {/* Image — clickable → product details */}
      <div
        onClick={() => navigate(`/products/${item._id}`)}
        className="cursor-pointer shrink-0 w-20 h-20 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 hover:border-primary/30 transition"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <ShoppingBag size={24} className="text-gray-600" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        {/* Name — clickable → product details */}
        <h3
          onClick={() => navigate(`/products/${item._id}`)}
          className="text-sm font-semibold text-gray-100 truncate cursor-pointer hover:text-primary transition-colors mb-0.5"
        >
          {item.name || "Unknown Product"}
        </h3>

        {item.category && (
          <div className="flex items-center gap-1 mb-2">
            <Zap size={10} className="text-primary/60" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              {item.category}
            </span>
          </div>
        )}

        <p className="text-primary text-sm font-medium mb-3">
          ₹{(item.price ?? 0).toLocaleString("en-IN")} each
        </p>

        {/* Qty controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={decrease}
            disabled={!canDecrease || loading}
            className="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
          >
            <Minus size={13} />
          </button>

          <span className="w-8 text-center text-sm font-semibold tabular-nums">
            {item.quantity}
          </span>

          <button
            onClick={increase}
            disabled={!canIncrease || loading}
            className="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
          >
            <Plus size={13} />
          </button>

          {item.countInStock !== undefined && (
            <span className={`text-[10px] ml-1 ${
              item.countInStock <= 5 ? "text-amber-400 font-medium" : "text-gray-600"
            }`}>
              {item.countInStock <= 5
                ? `Only ${item.countInStock} left`
                : `/ ${item.countInStock} in stock`}
            </span>
          )}
        </div>
      </div>

      {/* Right: total + remove */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <p className="text-base font-bold text-primary tabular-nums">
          ₹{itemTotal.toLocaleString("en-IN")}
        </p>
        <button
          onClick={remove}
          disabled={loading}
          className="w-7 h-7 rounded-md border border-red-500/30 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 disabled:opacity-40 flex items-center justify-center transition"
          aria-label="Remove item"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────
// Main Cart Page
// ─────────────────────────────────────────────
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, cartCount, totalPrice, loading } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Add some gear to get started.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-black font-semibold px-6 py-3 hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] transition"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 5000 ? 0 : 199;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Cart
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({cartCount} {cartCount === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* Items list */}
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <CartRow key={item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit sticky top-24">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white tabular-nums">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary" : "text-white tabular-nums"}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-600">
                    Free shipping on orders above ₹5,000
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-xl font-bold text-primary tabular-nums">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#68a500] text-black font-semibold py-3 rounded-lg hover:shadow-[0_0_16px_#76b900] transition"
              >
                Checkout
                <ArrowRight size={16} />
              </button>

              <Link
                to="/products"
                className="mt-3 w-full flex items-center justify-center text-xs text-gray-500 hover:text-gray-300 transition"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;