import { useEffect, useState, useRef, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { Search, X } from "lucide-react";
import api from "../../api/client";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../types/product";
import { getImageUrl } from "../../utils/getImageUrl";

/* ------------------ Constants ------------------ */
const CATEGORIES = [
  "All",
  "GPU",
  "CPU",
  "RAM",
  "Storage",
  "Motherboard",
  "Cooling System",
  "Power Supply",
  "PC Case",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Headset",
  "Microphone",
  "Laptop",
  "Accessory",
  "Gaming Console",
  "Handheld",
] as const;

const POPULAR_BRANDS = [
  "All",
  "NVIDIA",
  "AMD",
  "Intel",
  "ASUS",
  "MSI",
  "Corsair",
  "Logitech",
  "Razer",
  "Sony",
  "HyperX",
  "Cooler Master",
  "NZXT",
  "Lian Li",
  "Gigabyte",
  "Samsung",
  "Lenovo",
  "HP",
  "Acer",
] as const;

/* ------------------ Component ------------------ */
function Products(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchingProductsRef = useRef(false);
  const productsRequestIdRef = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("category");

  const hasActiveFilters =
    search || category !== "All" || brand !== "All" || sortOrder !== "default";

  /* ------------------ Fetch Products ------------------ */
  useEffect(() => {
    const requestId = productsRequestIdRef.current + 1;
    productsRequestIdRef.current = requestId;

    const fetchProducts = async () => {
      fetchingProductsRef.current = true;

      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await api.get("/products", {
          params: {
            page,
            limit: 15,
            search,
            category,
            brand,
            sort: sortOrder === "default" ? undefined : sortOrder,
          },
        });

        const newProducts: Product[] = res.data.products;

        if (requestId !== productsRequestIdRef.current) return;

        setProducts((prev) =>
          page === 1
            ? newProducts
            : [
              ...prev,
              ...newProducts.filter(
                (p) => !prev.some((x) => x._id === p._id),
              ),
            ],
        );

        setHasNextPage(res.data.pagination.hasNextPage);
      } catch (err) {
        console.error(err);
      } finally {
        if (requestId === productsRequestIdRef.current) {
          fetchingProductsRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchProducts();
  }, [page, search, category, brand, sortOrder]);

  /* ------------------ Reset page on filter change ------------------ */
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasNextPage(true);
  }, [search, category, brand, sortOrder]);

  /* ------------------ URL Category Sync ------------------ */
  useEffect(() => {
    if (
      urlCategory &&
      CATEGORIES.includes(urlCategory as (typeof CATEGORIES)[number])
    ) {
      setCategory(urlCategory as (typeof CATEGORIES)[number]);
    }
  }, [urlCategory]);

  /* ------------------ Search Suggestions (debounced) ------------------ */
  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await api.get("/products/suggestions", {
          params: { q: searchInput, limit: 5 },
        });
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput]);

  /* ------------------ Infinite Scroll Observer ------------------ */
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          hasNextPage &&
          !loading &&
          !loadingMore &&
          !fetchingProductsRef.current
        ) {
          fetchingProductsRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "300px",
        threshold: 0.1,
      },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [hasNextPage, loading, loadingMore, products.length]);

  /* ------------------ Event Handlers ------------------ */
  const handleSearch = () => {
    setSearch(searchInput.trim());
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("All");
    setBrand("All");
    setSortOrder("default");
    setPage(1);
    setProducts([]);
    navigate("/products", { replace: true });
  };

  /* ------------------ Skeleton Loader ------------------ */
  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] px-4 sm:px-8 lg:px-12 py-12 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-white/5 rounded w-64 mx-auto mb-10 animate-pulse" />

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl h-72 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-4 sm:px-8 lg:px-12 py-12 mt-10">
      <div className="max-w-7xl mx-auto mb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-3 border-b border-[#76b900]/20 pb-2">
            {category !== "All" ? `${category} Products` : "Browse Products"}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {category !== "All"
              ? `Discover premium ${category.toLowerCase()} for your ultimate setup`
              : "Explore gaming components and peripherals for your dream rig"}
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-40 bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4 flex-wrap justify-between shadow-lg">
          {/* Search */}
          <div className="flex w-full sm:w-auto flex-1">
            <div className="relative flex items-center w-full">
              <div className="flex items-center w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#76b900] transition">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  onKeyDown={handleKeyPress}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none px-3 text-white placeholder-gray-500"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput("")}>
                    <X className="text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="ml-3 bg-[#76b900] hover:bg-[#68a500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-black/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  {suggestionsLoading ? (
                    <div className="p-4 text-gray-400 text-sm animate-pulse">
                      Searching...
                    </div>
                  ) : (
                    suggestions.map((item) => (
                      <button
                        key={item._id}
                        onMouseDown={() => {
                          setSearchInput(item.name);
                          setSearch(item.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer transition"
                      >
                        {getImageUrl(item.images?.[0]) && (
                          <img
                            src={getImageUrl(item.images?.[0])}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.category}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters – stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#76b900] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="text-black bg-white">
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#76b900] transition-colors"
            >
              {POPULAR_BRANDS.map((b) => (
                <option key={b} value={b} className="text-black bg-white">
                  {b === "All" ? "All Brands" : b}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#76b900] transition-colors"
            >
              <option value="default" className="text-black bg-white">
                Sort by
              </option>
              <option value="low" className="text-black bg-white">
                Price: Low to High
              </option>
              <option value="high" className="text-black bg-white">
                Price: High to Low
              </option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 border border-white/10 rounded-lg text-gray-300 hover:text-[#76b900] hover:border-[#76b900]/60 transition-all"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group h-full"
                  >
                    <div className="h-full rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(118,185,0,0.6)]">
                      <ProductCard product={product} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Infinite scroll sentinel */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="h-24"
                aria-hidden="true"
              >
              </div>
            )}

            {loadingMore && (
              <div className="text-center mt-6 animate-pulse">
                <div className="inline-flex items-center gap-2 text-[#76b900]">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading more products...
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              {search
                ? `No results for "${search}"`
                : "Try adjusting your filters or search query."}
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-[#76b900] hover:bg-[#68a500] text-black font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
