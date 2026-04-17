import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCartControls } from "../../context/useCartControls";
import { Plus, Minus } from "lucide-react";

/**
 * Assumptions based on your existing CartContext usage:
 * - cart items already have proper shape (id, name, price, quantity, stock, image)
 * - no runtime changes needed
 */

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const { cart, clearCart, cartCount, totalPrice, loading } = useCart();

  /* Loading state */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-primary text-xl">Loading cart...</div>
      </div>
    );
  }

  /* Empty cart */
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Your cart is empty{" "}
            <i className="fa-solid fa-cart-shopping text-primary"></i>
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-[#76b900] text-black font-medium px-6 py-3 hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 py-10 px-4 mt-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-8">
          Shopping Cart ({cartCount})
        </h1>

        {/* Cart Items */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg shadow-black/30 overflow-hidden mb-6">
          <div className="p-6">
            {cart.map((item) => {
              const {
                increase,
                decrease,
                remove,
                canDecrease,
                loading: controlLoading,
              } = useCartControls(item.id, item.quantity, item.stock);

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-6 border-b border-white/10 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary text-lg font-medium mb-3">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={decrease}
                          disabled={!canDecrease || controlLoading}
                          className="w-8 h-8 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={20} />
                        </button>

                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={increase}
                          disabled={controlLoading}
                          className="w-8 h-8 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                    <p className="text-xl font-semibold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={remove}
                      disabled={controlLoading}
                      className="px-4 py-2 rounded-lg border border-red-500/60 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total + Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg shadow-black/30 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-primary">
                ₹{totalPrice.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearCart}
                className="px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-gray-100 font-medium hover:bg-white/10 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-3 rounded-lg bg-[#76b900] text-black font-medium hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
