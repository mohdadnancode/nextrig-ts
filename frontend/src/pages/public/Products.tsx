import { useEffect, useState, useRef, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { Search, X } from "lucide-react";
import api from "../../api/client";
import { motion } from "framer-motion";
import type { Product } from "../../types/product";

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
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [brand, setBrand] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("default");

  const [availableBrands] = useState<string[]>([...POPULAR_BRANDS]);

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* Infinite scroll */
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("category");

  /* ------------------ Fetch Products ------------------ */
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
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
            sort: sortOrder,
          },
        });

        if (!isMounted) return;

        const newProducts: Product[] = res.data.products;

        setProducts((prev) =>
          page === 1 ? newProducts : [...prev, ...newProducts],
        );

        setHasNextPage(res.data.pagination.hasNextPage);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [page, search, category, brand, sortOrder]);

  /* ------------------ URL Category Sync ------------------ */
  useEffect(() => {
    if (
      urlCategory &&
      CATEGORIES.includes(urlCategory as (typeof CATEGORIES)[number])
    ) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  /* ------------------ Search ------------------ */
  const handleSearch = (): void => setSearch(searchInput.trim());
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSearch();
  };

  const clearAllFilters = (): void => {
    setSearchInput("");
    setSearch("");
    setCategory("All");
    setBrand("All");
    setSortOrder("default");
    setPage(1);
    setProducts([]);
    navigate("/products", { replace: true });
  };

  /* ------------------ Filtering ------------------ */

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    const value = searchInput.toLowerCase();

    const results = products
      .map((p) => {
        const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();

        let score = 0;
        if (text.includes(value)) score += 2;
        if (p.category.toLowerCase().includes(value)) score += 1;

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.product);

    setSuggestions(results);
  }, [searchInput, products]);

  /* ------------------ Infinite Scroll ------------------ */

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasNextPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, loadingMore]);

  /* ------------------ Initial Loading ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-primary text-xl">
        Loading products...
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

        {/* Search + Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4 flex-wrap justify-between">
          {/* Search */}
          <div className="flex w-full sm:w-auto flex-1">
            <div className="flex items-center w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary transition relative">
              <Search className="text-gray-400 w-5 h-5" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKeyPress}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none px-3 text-white placeholder-gray-500"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-black/95 border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSearchInput(item.name);
                        setSearch(item.name);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-3 text-sm text-gray-300 hover:bg-white/5 cursor-pointer transition"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}

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

          {/* Filters */}
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
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
              {availableBrands.map((b) => (
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

            {(search ||
              category !== "All" ||
              brand !== "All" ||
              sortOrder !== "default") && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 border border-white/10 rounded-lg text-gray-300 hover:text-primary hover:border-[#76b900]/60 transition-all"
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
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Sentinel div for infinite scroll */}
            {hasNextPage && <div ref={loadMoreRef} className="h-10" />}

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="text-center text-primary mt-6 animate-pulse">
                Loading more products...
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
