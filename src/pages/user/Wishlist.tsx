import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";

const Wishlist: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    loading: wishlistLoading,
  } = useWishlist();
  const { addToCart } = useCart();

  if (authLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-[#76b900] text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Please log in to view your wishlist
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#76b900] text-black font-medium px-6 py-3 hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product);
      await removeFromWishlist(product.id);
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

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-4 sm:px-8 lg:px-12 py-12 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-4 border-b border-[#76b900]/20 pb-3">
              My Wishlist
            </h1>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-400 mb-8">
              Start adding products you love to your wishlist!
            </p>
            <Link
              to="/products"
              className="bg-[#76b900] hover:bg-[#68a500] text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(118,185,0,0.5)]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-4 sm:px-8 lg:px-12 py-12 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">
              My Wishlist ({wishlist.length})
            </h1>
            <p className="text-gray-400">Products you've saved for later</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="bg-[#76b900] hover:bg-[#68a500] text-black font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(118,185,0,0.5)]"
            >
              Move All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_0_15px_#76b90011] hover:shadow-[0_0_25px_#76b90033] transition-all duration-300 flex flex-col h-full"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-xl bg-gray-800/50 aspect-square flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-300"
                />

                {/* Remove from Wishlist */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#76b900]/20 text-[#76b900] text-xs px-2 py-1 rounded-md border border-[#76b900]/30">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[#76b900] font-bold text-sm md:text-base">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-[#76b900] hover:bg-[#68a500] text-black font-semibold text-sm px-4 py-2 rounded-md hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Add to Cart</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 border border-[#76b900] text-[#76b900] hover:bg-[#76b900] hover:text-black font-semibold text-sm px-4 py-2 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>View</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;