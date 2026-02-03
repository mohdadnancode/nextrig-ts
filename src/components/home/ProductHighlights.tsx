import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../api/client";

/* ------------------ Types ------------------ */

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
};

/* ------------------ Component ------------------ */

const ProductHighlights = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async (): Promise<void> => {
      try {
        setLoading(true);

        const { data } = await api.get<Product[]>("/products");

        const featured = data
          .filter((p) => p.featured === true)
          .sort(() => Math.random() - 0.5);

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
        <p className="text-[#76b900] text-lg animate-pulse">
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
          {/* Left */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white/10 border border-white/20 rounded-full text-[#76b900] items-center justify-center"
            aria-label="Scroll left"
          >
            ‹
          </button>

          {/* Right */}
          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white/10 border border-white/20 rounded-full text-[#76b900] items-center justify-center"
            aria-label="Scroll right"
          >
            ›
          </button>

          {/* Products */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="shrink-0 w-56 sm:w-64 snap-start bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative bg-gray-900/50 aspect-4/3 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                  <span className="absolute top-2 left-2 bg-[#76b900]/20 border border-[#76b900]/30 text-[#76b900] text-[10px] font-semibold px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col justify-between h-30">
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#76b900]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-black bg-[#76b900] rounded-md"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#76b900] text-[#76b900] hover:bg-[#76b900] hover:text-black text-sm font-semibold rounded-lg"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
