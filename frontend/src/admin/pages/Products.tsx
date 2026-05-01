import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { Plus, Trash2, Pencil } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import brokenImg from "../../assets/broken-img.webp";
import { getImageUrl } from "../../utils/getImageUrl";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [brands, setBrands] = useState<string[]>(["All"]);
  const [category, setCategory] = useState<string>("All");
  const [brand, setBrand] = useState<string>("All");

  const [priceSort, setPriceSort] = useState("none");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit" | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get("/products/meta");
        setCategories(res.data.categories);
        setBrands(res.data.brands);
      } catch {
        toast.error("Failed to load filters");
      }
    };

    fetchMeta();
  }, []);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  // reset page ONLY when needed
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, brand, priceSort]);

  // fetch
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          category,
          brand,
          sort: priceSort === "none" ? "default" : priceSort,
        },
      });

      const { products, pagination } = res.data;

      setProducts(products || []);
      setTotalPages(pagination.pages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, brand, priceSort]);

  // main effect
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // clear filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceSort("none");
    setPage(1);
    toast.success("Filters cleared");
  };

  // confirm actions
  const openDelete = (p: Product) => {
    setSelectedProduct(p);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const openEdit = (p: Product) => {
    setSelectedProduct(p);
    setConfirmType("edit");
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmType(null);
    setSelectedProduct(null);
  };

  const handleConfirm = async () => {
    if (!selectedProduct || !confirmType) return;

    try {
      if (confirmType === "delete") {
        await api.delete(`/products/${selectedProduct._id}`);
        toast.success("Product deleted");

        // always refetch (IMPORTANT)
        fetchProducts();
      }

      if (confirmType === "edit") {
        navigate(`/admin/products/${selectedProduct._id}/edit`);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      closeConfirm();
    }
  };

  const getPageNumbers = () => {
    const result: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
      return result;
    }

    result.push(1);

    if (page > 3) result.push("...");

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) result.push(i);
    }

    if (page < totalPages - 2) result.push("...");

    result.push(totalPages);

    return result;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-[#76b900] text-black px-4 py-2 rounded flex items-center gap-2 w-fit hover:bg-[#6aa800]"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          className="input"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b === "All" ? "All Brands" : b}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
        >
          <option value="none">Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <button
          onClick={clearFilters}
          className="border border-white/10 rounded hover:text-primary"
        >
          Clear
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center py-10 text-gray-400">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-gray-400">No products found</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="p-3 w-20">Image</th>
                  <th className="p-3 w-70">Name</th>
                  <th className="p-3 w-27.5">Brand</th>
                  <th className="p-3 w-27.5">Category</th>
                  <th className="p-3 w-25 text-right">Price</th>
                  <th className="p-3 w-25 text-center">Featured</th>
                  <th className="p-3 w-25 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-3">
                      <img
                        src={getImageUrl(p.images?.[0]) || brokenImg}
                        alt={p.name}
                        className="w-12 h-12 rounded object-cover mx-auto"
                      />
                    </td>

                    <td className="p-3 truncate">{p.name}</td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 text-right">₹{p.price}</td>

                    <td className="p-3 text-center">
                      {p.featured ? "Yes" : "No"}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-blue-400"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => openDelete(p)}
                          className="text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-[#0b0b0b] border border-white/10 rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={getImageUrl(p.images?.[0]) || brokenImg}
                    alt={p.name}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-400">
                      {p.brand} • {p.category}
                    </p>
                    <p className="text-sm mt-1">₹{p.price}</p>
                    <p className="text-xs text-gray-500">
                      Featured: {p.featured ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 border border-blue-500/30 text-blue-400 py-1.5 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDelete(p)}
                    className="flex-1 border border-red-500/30 text-red-400 py-1.5 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {(
            <div className="relative mt-6 flex items-center justify-center">
              <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded border border-white/20 text-sm disabled:opacity-40 hover:border-primary transition"
                >
                  Prev
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${p}-${i}`}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded text-sm transition ${
                        p === page
                          ? "bg-primary text-black"
                          : "border border-white/20 hover:border-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded border border-white/20 text-sm disabled:opacity-40 hover:border-primary transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm */}
      <ConfirmModal
        open={confirmOpen}
        title="Are you sure?"
        message={
          confirmType === "delete"
            ? "This product will be permanently deleted."
            : "You are about to edit this product."
        }
        confirmText={confirmType === "delete" ? "Delete" : "Continue"}
        danger={confirmType === "delete"}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default Products;
