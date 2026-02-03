import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useCartControls } from "../context/useCartControls";
import { Heart, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "../types/product";
import type { MouseEvent } from "react";

/* ------------------ Props ------------------ */

type ProductCardProps = {
  product: Product;
};

/* ------------------ Component ------------------ */

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { cart, addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist, loading } = useWishlist();
  const { user } = useAuth();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const maxStock = product.stock ?? 10;

  const {
    increase,
    decrease,
    remove,
    canDecrease,
    canIncrease,
    loading: controlLoading,
  } = useCartControls(product.id, quantity, maxStock);

  const handleProductClick = (): void => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product);
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    toggleWishlist(product);
  };

  const wishlisted = isInWishlist(product.id);

  return (
    <div
      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#76b900]/40 hover:shadow-[0_0_15px_#76b90033] hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer h-full"
      onClick={handleProductClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl bg-gray-800/50 aspect-square flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-36 object-contain group-hover:scale-110 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#76b900]/20 text-[#76b900] text-xs px-2 py-1 rounded-md border border-[#76b900]/30">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className={`absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
            wishlisted
              ? "bg-red-500/10 hover:bg-red-500/20"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-400 hover:fill-red-400"
            } ${loading ? "animate-pulse" : ""}`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-white font-semibold text-sm truncate mb-1 group-hover:text-[#76b900] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#76b900] font-bold text-sm">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>

        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="mt-3 w-full bg-[#76b900] hover:bg-[#68a500] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm px-3 py-2 rounded-md transition-all duration-300 flex items-center justify-center gap-1"
          >
            <span>Add</span>
            <ShoppingCart size={16} />
          </button>
        ) : (
          <div
            className="mt-3 w-full flex items-center justify-between bg-black/40 border border-[#76b900]/40 rounded-md px-2 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Minus */}
            <button
              disabled={!canDecrease || controlLoading}
              onClick={decrease}
              className={`px-2 text-lg font-bold ${
                !canDecrease || controlLoading
                  ? "text-gray-500"
                  : "text-[#76b900]"
              }`}
            >
              <Minus size={20} />
            </button>

            {/* Quantity */}
            <span className="text-white font-semibold text-sm">{quantity}</span>

            {/* Plus */}
            <button
              onClick={increase}
              disabled={controlLoading}
              className={`${!canIncrease ? "text-gray-500" : "text-[#76b900]"}`}
            >
              <Plus size={20} />
            </button>

            {/* Delete */}
            <button
              onClick={remove}
              disabled={controlLoading}
              className="ml-2 text-red-400 hover:text-red-500 hover:scale-110 transition disabled:opacity-50"
              title="Remove from cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
