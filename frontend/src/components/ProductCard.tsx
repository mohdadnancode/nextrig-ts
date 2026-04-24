import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/useCart";
import { useWishlist } from "../context/Wishlist/useWishlist";
import { useAuth } from "../context/Auth/useAuth";
import { useCartControls } from "../context/useCartControls";
import { Heart, ShoppingCart, Plus, Minus, Trash2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { Product } from "../types/product";
import type { MouseEvent } from "react";
import brokenImg from "../assets/broken-img.webp";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { cart, addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist, loading } = useWishlist();
  const { user } = useAuth();

  const cartItem = cart.find((item) => item._id === product._id);
  const quantity: number = cartItem?.quantity ?? 0;

  const maxStock: number = product.countInStock ?? 10;

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
      className="group relative flex flex-col h-full cursor-pointer rounded-2xl border border-white/10 bg-[#0b0f0e] transition-all duration-300 hover:border-primary/40"
    >
      {/* Image */}
      <div className="relative h-[160px] bg-black/40 flex items-center justify-center p-4">
        <img
          src={product.images?.[0] || brokenImg}
          alt={product.name}
          className="h-28 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/10 hover:border-primary/40 transition"
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

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={12} className="text-primary/60" />
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm font-medium text-gray-200 leading-snug line-clamp-2 group-hover:text-white transition">
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <p className="text-lg font-semibold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="mt-3 w-full rounded-lg border border-primary/40 bg-primary text-black font-semibold py-2 transition hover:bg-primaryDark flex items-center justify-center gap-2"
            >
              <span>Add</span>
              <ShoppingCart size={16} />
            </button>
          ) : (
            <div
              className="mt-3 flex items-center justify-between bg-black/50 border border-primary/30 rounded-lg px-3 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                disabled={!canDecrease || controlLoading}
                onClick={decrease}
                className="text-primary disabled:text-gray-500"
              >
                <Minus size={18} />
              </button>

              <span className="text-white text-sm font-medium">{quantity}</span>

              <button
                onClick={increase}
                disabled={!canIncrease || controlLoading}
                className="text-primary disabled:text-gray-500"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={remove}
                className="text-red-400 hover:text-red-500 transition"
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
