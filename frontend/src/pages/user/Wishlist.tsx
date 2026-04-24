import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/Wishlist/useWishlist";
import { useCart } from "../../context/Cart/useCart";
import { useAuth } from "../../context/Auth/useAuth";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import { Heart, ShoppingCart, X, ArrowRight, Zap, Trash2 } from "lucide-react";

const Wishlist: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { addToCart } = useCart();

  // ── Loading ──
  if (authLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-xs tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Heart size={28} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Sign in to view your wishlist
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            Save products you love for later.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] transition text-sm"
          >
            Sign in <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Handlers (unchanged) ──
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      await removeFromWishlist(product._id);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleMoveAllToCart = async () => {
    if (wishlist.length === 0) return;
    try {
      for (const product of wishlist) {
        await addToCart(product);
      }
      await clearWishlist();
      toast.success("All items moved to cart");
    } catch {
      toast.error("Failed to move all items");
    }
  };

  // ── Empty ──
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Heart size={28} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Wishlist is empty
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            Start saving gear you want to grab later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] transition text-sm"
          >
            Browse Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Wishlist
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({wishlist.length} {wishlist.length === 1 ? "item" : "items"})
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMoveAllToCart}
              className="text-xs font-semibold bg-primary text-black px-3 py-1.5 rounded-lg hover:bg-[#68a500] hover:shadow-[0_0_12px_#76b900] transition flex items-center gap-1.5"
            >
              <ShoppingCart size={12} />
              Move all to cart
            </button>
            <button
              onClick={clearWishlist}
              className="text-xs text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="group relative flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] hover:border-primary/25 hover:bg-white/[0.05] transition-all duration-300"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-500 hover:text-red-400 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <X size={11} />
              </button>

              {/* Category badge */}
              {product.category && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 border border-white/10 rounded-md px-1.5 py-0.5">
                  <Zap size={8} className="text-primary/70" />
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Image */}
              <Link
                to={`/products/${product._id}`}
                className="block h-[140px] bg-black/30 rounded-t-xl items-center justify-center p-4 overflow-hidden"
              >
                <img
                  src={product.images?.[0] ?? ""}
                  alt={product.name}
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <Link
                  to={`/products/${product._id}`}
                  className="text-xs font-medium text-gray-200 line-clamp-2 hover:text-primary transition-colors mb-1 leading-snug"
                >
                  {product.name}
                </Link>

                <p className="text-primary text-sm font-bold mb-3">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto w-full flex items-center justify-center gap-1.5 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-gray-300 hover:text-black text-xs font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  <ShoppingCart size={12} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;