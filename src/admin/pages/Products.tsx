import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { Plus, Trash2, Pencil } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";

const PER_PAGE = 10;

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "edit" | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // FETCH
  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data ?? []);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //  FILTER
  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      data = data.filter((p) => p.category === category);
    }

    if (brand !== "all") {
      data = data.filter((p) => p.brand === brand);
    }

    if (priceSort === "low") {
      data.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (priceSort === "high") {
      data.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFiltered(data);
  }, [products, search, category, brand, priceSort]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, brand, priceSort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setPriceSort("none");
    toast.success("Filters cleared");
  };

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginatedProducts = filtered.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  /*  CONFIRM  */
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
        await api.delete(`/products/${selectedProduct.id}`);
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
        toast.success("Product deleted");
      }

      if (confirmType === "edit") {
        navigate(`/admin/products/${selectedProduct.id}/edit`);
      }
    } catch {
      toast.error("Action failed");
    } finally {
      closeConfirm();
    }
  };

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const brands = ["all", ...new Set(products.map((p) => p.brand))];

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
              {c === "all" ? "All Categories" : c}
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
              {b === "all" ? "All Brands" : b}
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
          className="border border-white/10 rounded hover:text-[#76b900]"
        >
          Clear
        </button>
      </div>

      {/* Desktop Table */}
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
            {paginatedProducts.map((p: Product) => (
              <tr
                key={p.id}
                className="border-b border-white/5  hover:bg-white/5"
              >
                <td className="p-3 w-20">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded object-cover mx-auto"
                  />
                </td>

                <td className="p-3 w-70 truncate">{p.name}</td>

                <td className="p-3 w-27.5">{p.brand}</td>

                <td className="p-3 w-27.5">{p.category}</td>

                <td className="p-3 w-25 text-right">₹{p.price}</td>

                <td className="p-3 w-25 text-center">
                  {p.featured ? "Yes" : "No"}
                </td>

                <td className="p-3 w-25">
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.map((p: Product) => (
          <div
            key={p.id}
            className="bg-[#0b0b0b] border border-white/10 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <img
                src={p.image}
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

        {paginatedProducts.length === 0 && (
          <p className="text-center text-gray-400">No products found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Modal */}
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
