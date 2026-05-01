import { useEffect, useState, type JSX } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/Auth/useAuth";
import { useCart } from "../../context/Cart/useCart";
import { useWishlist } from "../../context/Wishlist/useWishlist";
import { useCartControls } from "../../context/useCartControls";
import brokenImg from "../../assets/broken-img.webp";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";
import type { Product } from "../../types/product";

const ProductDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const { cart, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const cartItem = cart.find((i) => i._id === product?._id);
  const quantity = cartItem?.quantity ?? 0;
  const maxStock = product?.countInStock ?? 0;
  const inStock = maxStock > 0;
  const wishlisted = product ? isInWishlist(product._id) : false;

  const {
    increase,
    decrease,
    remove,
    canIncrease,
    canDecrease,
    loading: cartLoading,
  } = useCartControls(product?._id ?? "", quantity, maxStock);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await api.get<Product>(`/products/${id}`);
        if (alive) setProduct(res.data);
      } catch {
        if (alive) setError("not found");
      } finally {
        if (alive) setLoading(false);
      }
    };
    if (id) load();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => { setSelectedIdx(0); }, [id]);

  const gate = (msg: string): boolean => {
    if (isAuthenticated) return false;
    toast.error(msg);
    navigate("/login");
    return true;
  };

  const handleAddToCart = () => {
    if (!gate("Login to add items") && product) addToCart(product);
  };

  const handleBuyNow = () => {
    if (!product || gate("Login to buy")) return;
    navigate("/checkout", {
      state: {
        buyNowItem: {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          countInStock: product.countInStock,
          image: getImageUrl(product.images?.[0]),
          category: product.category,
        },
      },
    });
  };

  const handleWishlist = () => {
    if (!product || gate("Login required")) return;
    toggleWishlist(product);
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      toast("Sharing not supported on this browser");
    }
  };

  const getOptimized = (url: string) =>
    url.replace("/upload/", "/upload/w_600,q_auto,f_auto/");

  /* ── Loading ── */
  if (loading)
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#76b900] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase">Loading</p>
        </div>
      </div>
    );

  /* ── Error ── */
  if (error || !product)
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Product not found</h1>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-[#76b900] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#68a500] transition"
          >
            <ArrowLeft size={15} /> Back to Products
          </Link>
        </div>
      </div>
    );

  const images = product.images?.length ? product.images.map(img => getImageUrl(img)) : [brokenImg];
  const active = images[Math.min(selectedIdx, images.length - 1)] as string;
  const specEntries = product.specs ? Object.entries(product.specs) : [];

  const ctaProps = {
    inStock, quantity, cartLoading, canDecrease, canIncrease, wishlisted,
    onAdd: handleAddToCart, onBuyNow: handleBuyNow,
    onIncrease: increase, onDecrease: decrease, onRemove: remove,
    onWishlist: handleWishlist, onShare: handleShare,
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-[#76b900] transition group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </button>

        {/* ── 3-column flex row ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ══ COL 1: Image Gallery — shrink-0, fixed width ══ */}
          <div className="flex flex-row gap-3 shrink-0">

            {/* Vertical thumbnails — desktop */}
            <div className="hidden sm:flex flex-col gap-2 shrink-0">
              {images.slice(0, 6).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  style={{ width: 44, height: 44, minWidth: 44, minHeight: 44 }}
                  className={`rounded-lg border-2 bg-white p-1 transition-all duration-200 flex items-center justify-center ${
                    selectedIdx === i
                      ? "border-[#76b900] shadow-[0_0_8px_rgba(118,185,0,0.35)]"
                      : "border-white/10 hover:border-[#76b900]/40"
                  }`}
                >
                  <img src={src} className="w-full h-full object-contain" alt="" />
                </button>
              ))}
            </div>

            {/* Main image — inline style locks it, no Tailwind flex override */}
            <div className="flex flex-col gap-3">
              <div
                style={{ width: 300, height: 300, minWidth: 300, minHeight: 300 }}
                className="bg-white rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative"
              >
                <img
                  key={active}
                  src={getOptimized(active)}
                  alt={product.name}
                  style={{ width: "82%", height: "82%", objectFit: "contain" }}
                  className="transition-all duration-300"
                />
              </div>

              {/* Mobile thumbnails — hidden on desktop */}
              <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
                {images.slice(0, 8).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    style={{ width: 44, height: 44, minWidth: 44, minHeight: 44 }}
                    className={`rounded-lg border-2 bg-white p-1 shrink-0 ${
                      selectedIdx === i ? "border-[#76b900]" : "border-white/10"
                    }`}
                  >
                    <img src={src} className="w-full h-full object-contain" alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ COL 2: Product Info — flex‑1 (takes half) ══ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Zap size={10} />
                {product.category}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                inStock
                  ? "border-primary/20 bg-primary/[0.05] text-primary"
                  : "border-red-500/25 bg-red-500/10 text-red-300"
              }`}>
                <BadgeCheck size={10} />
                {inStock ? `${maxStock} in stock` : "Out of stock"}
              </span>
              {inStock && maxStock <= 5 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                  <AlertTriangle size={10} />
                  Only {maxStock} left!
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-base sm:text-lg font-semibold text-white leading-snug">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-xs text-gray-500">
                by <span className="text-primary font-medium">{product.brand}</span>
              </p>
            )}

            <div className="border-t border-white/[0.06]" />

            {/* Price — mobile only */}
            <div className="lg:hidden">
              <p className="text-2xl font-black text-primary">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 leading-relaxed">
              {product.description ||
                "A performance-focused component picked for clean builds, reliable thermals, and a smoother gaming setup."}
            </p>

            {/* Specs */}
            {specEntries.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-2">
                  Specifications
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {specEntries.map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2"
                    >
                      <p className="text-[9px] uppercase tracking-wide text-gray-600 mb-0.5">{k}</p>
                      <p className="text-[11px] font-medium text-gray-200 leading-tight truncate">
                        {String(v)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perks */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { icon: <Truck size={10} className="text-primary shrink-0" />, label: "Free over ₹5,000" },
                { icon: <RotateCcw size={10} className="text-primary shrink-0" />, label: "30-day returns" },
                { icon: <ShieldCheck size={10} className="text-primary shrink-0" />, label: "2-yr warranty" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5 text-[10px] text-gray-400"
                >
                  {icon}
                  {label}
                </div>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="lg:hidden pt-1">
              <CartControls {...ctaProps} />
            </div>
          </div>

          {/* COL 3: Price Panel */}
          <div className="hidden lg:block flex-1 sticky top-24">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-8 w-full">

              {/* Price */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                  NextRig Price
                </p>
                <p className="text-2xl font-black text-primary leading-none">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Inclusive of all taxes</p>
              </div>

              {/* Stock info */}
              <div className="space-y-0.5 text-xs">
                <p className="text-gray-400">FREE delivery on eligible orders</p>
                <p className={`font-semibold ${inStock ? "text-primary" : "text-red-400"}`}>
                  {inStock ? "In Stock" : "Currently unavailable"}
                </p>
                <p className="text-[10px] text-gray-600">
                  Ships from NextRig · Secure transaction
                </p>
              </div>

              <div className="border-t border-white/[0.07]" />

              <CartControls {...ctaProps} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ══ CartControls (unchanged) ══ */
type CartControlsProps = {
  inStock: boolean; quantity: number; cartLoading: boolean;
  canDecrease: boolean; canIncrease: boolean; wishlisted: boolean;
  onAdd: () => void; onBuyNow: () => void; onIncrease: () => void;
  onDecrease: () => void; onRemove: () => void;
  onWishlist: () => void; onShare: () => void;
};

const CartControls = ({
  inStock, quantity, cartLoading, canDecrease, canIncrease, wishlisted,
  onAdd, onBuyNow, onIncrease, onDecrease, onRemove, onWishlist, onShare,
}: CartControlsProps) => (
  <div className="space-y-2">
    {!inStock ? (
      <button
        disabled
        className="w-full rounded-lg bg-gray-800 py-2.5 text-sm font-semibold text-gray-500 cursor-not-allowed"
      >
        Out of Stock
      </button>
    ) : quantity === 0 ? (
      <>
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-black hover:bg-[#68a500] hover:shadow-[0_0_12px_#76b900] transition"
        >
          <ShoppingCart size={15} /> Add to Cart
        </button>
        <button
          onClick={onBuyNow}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          Buy Now <ArrowRight size={14} />
        </button>
      </>
    ) : (
      <>
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-black/40 px-3 py-2">
          <button
            onClick={onDecrease}
            disabled={!canDecrease || cartLoading}
            className="w-7 h-7 flex items-center justify-center text-primary disabled:text-gray-600 hover:bg-white/5 rounded transition"
          >
            <Minus size={15} />
          </button>
          <span className="text-sm font-bold tabular-nums">{quantity}</span>
          <button
            onClick={onIncrease}
            disabled={!canIncrease || cartLoading}
            className="w-7 h-7 flex items-center justify-center text-primary disabled:text-gray-600 hover:bg-white/5 rounded transition"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={onRemove}
            disabled={cartLoading}
            className="w-7 h-7 flex items-center justify-center text-red-400 disabled:opacity-40 hover:text-red-300 hover:bg-white/5 rounded transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <button
          onClick={onBuyNow}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          Buy Now <ArrowRight size={14} />
        </button>
      </>
    )}

    <div className="grid grid-cols-2 gap-2 pt-0.5">
      <button
        onClick={onWishlist}
        className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition ${
          wishlisted
            ? "border-red-500/50 bg-red-500/[0.06] text-red-400"
            : "border-white/10 text-gray-400 hover:border-primary/40 hover:text-primary"
        }`}
      >
        <Heart size={13} className={wishlisted ? "fill-red-500" : ""} />
        {wishlisted ? "Saved" : "Save"}
      </button>
      <button
        onClick={onShare}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-semibold text-gray-400 hover:border-white/20 hover:text-white transition"
      >
        <Share2 size={13} /> Share
      </button>
    </div>
  </div>
);

export default ProductDetails;