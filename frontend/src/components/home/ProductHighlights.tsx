import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../api/client";
import { getImageUrl } from "../../utils/getImageUrl";

/* ------------------ Types ------------------ */

type Product = {
  _id: string;
  name: string;
  price: number;
  images: (string | { url: string; public_id: string })[];
  category: string;
  featured?: boolean;
};
/* ------------------ Component ------------------ */

const ProductHighlights = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/products", { params: { limit: 100 } });

        const products = data.products || [];

        const featured = products
          .filter((p: Product) => p.featured)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);

        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const scrollLeft = (): void => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = (): void => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  /* ------------------ States ------------------ */

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] text-white py-16 text-center">
        <p className="text-primary text-lg animate-pulse">
          Loading featured products...
        </p>
      </div>
    );
  }

  if (!featuredProducts.length) {
    return (
      <div className="bg-[#0d0d0d] text-white py-16 text-center">
        <p className="text-gray-400 text-lg">
          No featured products available 🚀
        </p>
      </div>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <section className="bg-[#0d0d0d] text-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Featured Gear
            </p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-100">
              Precision-Tuned Hardware
            </h2>
          </div>
          <span className="hidden sm:block h-px flex-1 sm:ml-8 bg-linear-to-r from-[#76b900] to-transparent" />
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white/10 border border-white/20 rounded-full text-primary items-center justify-center hover:bg-white/20 hover:shadow-[0_0_12px_rgba(118,185,0,0.5)] transition-all duration-300"
            aria-label="Scroll left"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white/10 border border-white/20 rounded-full text-primary items-center justify-center hover:bg-white/20 hover:shadow-[0_0_12px_rgba(118,185,0,0.5)] transition-all duration-300"
            aria-label="Scroll right"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Product row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="shrink-0 w-44 sm:w-48 snap-start bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:shadow-[0_0_12px_#76b90055] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative bg-black/40 aspect-square flex items-center justify-center p-4">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="object-contain max-h-32 transition-transform duration-300 group-hover:scale-110"
                  />

                  <span className="absolute top-2 left-2 bg-[#76b900]/20 border border-[#76b900]/30 text-primary text-[10px] px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="px-3 py-2 space-y-1">
                  <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <Link
                      to={`/products/${product._id}`}
                      className="text-[10px] px-2 py-1 bg-[#76b900] text-black rounded hover:bg-[#68a500] transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#76b900] text-primary hover:bg-[#76b900] hover:text-black text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(118,185,0,0.3)]"
          >
            <span>View All Products</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductHighlights;
