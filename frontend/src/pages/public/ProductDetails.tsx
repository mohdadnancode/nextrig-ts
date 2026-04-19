import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCartControls } from "../../context/useCartControls";
import brokenImg from "../../assets/broken-img.webp";
// import brokenImg2 from "../../assets/broken-img2.webp"
import {
  Heart,
  Share2,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";
import type { Product } from "../../types/product";

/* ------------------ Component ------------------ */

const ProductDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { cart, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const cartItem = cart.find((item) => item._id === product?._id);
  const quantity = cartItem?.quantity ?? 0;
  const maxStock = product?.countInStock ?? 0;

  const {
    increase,
    decrease,
    remove,
    canIncrease,
    canDecrease,
    loading: cartLoading,
  } = useCartControls(product?._id ?? "", quantity, maxStock);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  /* ------------------ Fetch product ------------------ */
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await api.get<Product>(`/products/${id}`);
        if (isMounted) setProduct(res.data);
      } catch {
        if (isMounted) setError("Product not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = (): void => {
    if (!isAuthenticated) {
      toast.error("Please login to add items");
      return;
    }
    if (product) addToCart(product);
  };

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-primary text-xl">Loading product...</div>
      </div>
    );
  }

  /* ------------------ Error ------------------ */
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Link
          to="/products"
          className="bg-[#76b900] text-black px-6 py-3 rounded-lg"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-4 pt-20">
      {/* Back */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-primary"
        >
          ← Back to Products
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-900/50 rounded-lg p-4">
            <img
              src={product.images?.[0] || brokenImg}
              alt={product.name}
              className="max-h-72 object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <span className="inline-block mb-2 px-3 py-1 bg-[#76b900]/20 text-primary text-xs rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-2">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Cart Controls */}
            {product.countInStock === 0 ? (
              <div className="w-full text-center">
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-400 font-semibold py-3 rounded-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
                <p className="text-red-400 text-sm mt-2">
                  This product is currently unavailable
                </p>
              </div>
            ) : quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#76b900] hover:bg-[#68a500] text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-black/40 border border-[#76b900]/40 rounded-lg px-4 py-3">
                <button
                  onClick={decrease}
                  disabled={!canDecrease || cartLoading}
                  className={`${
                    !canDecrease || cartLoading
                      ? "text-gray-500"
                      : "text-primary"
                  }`}
                >
                  <Minus size={20} />
                </button>

                <span className="text-lg font-semibold">{quantity}</span>

                <button
                  onClick={increase}
                  disabled={!canIncrease || cartLoading}
                  className={`${
                    !canIncrease || cartLoading
                      ? "text-gray-500"
                      : "text-primary"
                  }`}
                >
                  <Plus size={20} />
                </button>

                <button
                  onClick={remove}
                  disabled={cartLoading}
                  className="text-red-400 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            {/* Wishlist + Share */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  isAuthenticated
                    ? toggleWishlist(product)
                    : toast.error("Login required")
                }
                className={`flex-1 border py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  isWishlisted
                    ? "border-red-500 text-red-400"
                    : "border-[#76b900] text-primary"
                }`}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-red-500" : ""}
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <button
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: product.name,
                        url: window.location.href,
                      })
                    : toast("Sharing not supported")
                }
                className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Specs + Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* Specs */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-2">
                  Specifications
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  {product.specs && (
                    <div className="mt-3 space-y-1">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <p key={key}>
                          <span className="text-gray-300">{key}:</span>{" "}
                          {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-2">
                  Shipping & Returns
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <Truck size={16} /> Free shipping over ₹5000
                  </li>
                  <li className="flex items-center gap-2">
                    <RotateCcw size={16} /> 30-day return policy
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck size={16} /> 2-year warranty
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
