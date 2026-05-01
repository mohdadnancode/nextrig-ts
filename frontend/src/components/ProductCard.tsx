import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/useCart";
import { useWishlist } from "../context/Wishlist/useWishlist";
import { useAuth } from "../context/Auth/useAuth";
import { useCartControls } from "../context/useCartControls";
import { Heart, ShoppingCart, Plus, Minus, Trash2, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { Product } from "../types/product";
import type { MouseEvent } from "react";
import brokenImg from "../assets/broken-img.webp";
import { getImageUrl } from "../utils/getImageUrl";

type ProductCardProps = {
  product: Product;
};

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { cart, addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist, loading } = useWishlist();
  const { user } = useAuth();

  const cartItem = cart.find((item) => item._id === product._id);
  const quantity: number = cartItem?.quantity ?? 0;
  const maxStock: number = product.countInStock ?? 0;
  const inStock = maxStock > 0;
  const lowStock = inStock && maxStock <= LOW_STOCK_THRESHOLD;

  const {
    increase,
    decrease,
    remove,
    canDecrease,
    canIncrease,
    loading: controlLoading,
  } = useCartControls(product._id, quantity, maxStock);

  const handleProductClick = (): void => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!inStock) {
      toast.error("This product is out of stock");
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

  const wishlisted: boolean = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={handleProductClick}
      className={`group relative flex h-full min-h-[330px] flex-col cursor-pointer rounded-2xl border bg-[#0b0f0e] transition-all duration-300 ${
        !inStock
          ? "border-white/5 opacity-75"
          : "border-white/10 hover:border-primary/40"
      }`}
    >
      <div className="relative flex h-[160px] shrink-0 items-center justify-center bg-black/40 p-4">
        <img
          src={getImageUrl(product.images?.[0]) || brokenImg}
          alt={product.name}
          className={`h-28 max-w-full object-contain transition-transform duration-300 ${
            inStock ? "group-hover:scale-105" : "grayscale-[30%]"
          }`}
        />

        {/* Out of stock overlay badge */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-2xl">
            <span className="bg-red-500/90 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 transition hover:border-primary/40"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={`transition ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex min-w-0 items-center gap-2">
          <Zap size={12} className="text-primary/60" />
          <span className="truncate text-[10px] uppercase tracking-wide text-gray-500">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm font-medium leading-snug text-gray-200 line-clamp-2 transition group-hover:text-white">
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <p className="text-lg font-semibold text-primary">
            Rs. {product.price.toLocaleString("en-IN")}
          </p>

          {/* Low stock warning */}
          {lowStock && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle size={11} className="text-amber-400" />
              <span className="text-[10px] font-medium text-amber-400">
                Only {maxStock} left
              </span>
            </div>
          )}

          {/* Out of stock — disabled button */}
          {!inStock ? (
            <button
              disabled
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary py-2 font-semibold text-black transition hover:bg-primaryDark"
            >
              <span>Add</span>
              <ShoppingCart size={16} />
            </button>
          ) : (
            <div
              className="mt-2 flex items-center justify-between rounded-lg border border-primary/30 bg-black/50 px-3 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                disabled={!canDecrease || controlLoading}
                onClick={decrease}
                className="text-primary disabled:text-gray-500"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>

              <span className="text-sm font-medium text-white">{quantity}</span>

              <button
                onClick={increase}
                disabled={!canIncrease || controlLoading}
                className="text-primary disabled:text-gray-500"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={remove}
                className="text-red-400 transition hover:text-red-500"
                aria-label="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
