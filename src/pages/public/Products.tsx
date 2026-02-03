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

  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [brand, setBrand] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("default");

  const [availableBrands, setAvailableBrands] = useState<string[]>([
    ...POPULAR_BRANDS,
  ]);

  /* Infinite scroll */
  const [visibleCount, setVisibleCount] = useState<number>(15);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef<boolean>(false);

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get("category");

  /* ------------------ Fetch Products ------------------ */
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      if (hasFetched.current) return;

      try {
        const response = await api.get<Product[]>("/products");

        // Shuffle order
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        setProducts(shuffled);

        // Build brand list
        const brandsFromProducts = [
          ...new Set(response.data.map((p) => p.brand)),
        ].filter(Boolean) as string[];

        const allBrands = [
          ...new Set([...POPULAR_BRANDS, ...brandsFromProducts]),
        ];

        setAvailableBrands(allBrands);
        hasFetched.current = true;
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ------------------ URL Category Sync ------------------ */
  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory as any)) {
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
    setVisibleCount(15);
    navigate("/products", { replace: true });
  };

  /* ------------------ Filtering ------------------ */
  const filteredProducts = products
    .filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .filter((p) => (category === "All" ? true : p.category === category))
    .filter((p) => (brand === "All" ? true : p.brand === brand))
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  /* Reset visible count when filters change */
  useEffect(() => {
    setVisibleCount(Math.min(15, filteredProducts.length || 15));
  }, [search, category, brand, sortOrder, filteredProducts.length]);

  /* ------------------ Infinite Scroll ------------------ */
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (filteredProducts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !loadingMore &&
          visibleCount < filteredProducts.length
        ) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + 15, filteredProducts.length),
            );
            setLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length, loadingMore, visibleCount]);

  /* ------------------ Initial Loading ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#76b900] text-xl">
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#76b900] transition-colors"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
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
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Sentinel div for infinite scroll */}
            {visibleCount < filteredProducts.length && (
              <div ref={loadMoreRef} className="h-10" />
            )}

            {/* Loading more indicator */}
            {loadingMore && visibleCount < filteredProducts.length && (
              <div className="text-center text-[#76b900] mt-6 animate-pulse">
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
