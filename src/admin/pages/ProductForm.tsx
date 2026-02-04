import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";

const emptyProduct: Product = {
  name: "",
  brand: "",
  category: "",
  price: 0,
  description: "",
  image: "",
  featured: false,
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/products/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => toast.error("Failed to load product"));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;

    const name = target.name;

    let value: string | boolean | number;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = target.checked;
    } else if (name === "price") {
      value = Number(target.value);
    } else {
      value = target.value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!form.name || !form.brand || !form.category || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data: products } = await api.get<Product[]>("/products");

      const duplicate = products.find(
        (p: Product) =>
          p.name.toLowerCase() === form.name.toLowerCase() && p.id !== id, // allow same name when editing same product
      );

      if (duplicate) {
        toast.error("Product with this name already exists");
        setLoading(false);
        return;
      }

      if (id) {
        // EDIT
        await api.patch(`/products/${id}`, {
          ...form,
          updatedAt: new Date().toISOString(),
        });

        toast.success("Product updated successfully");
      } else {
        // ADD
        const maxId = products.length
          ? Math.max(...products.map((p) => Number(p.id)))
          : 0;

        const newProduct = {
          ...form,
          id: String(maxId + 1),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await api.post("/products", newProduct);
        toast.success("Product added successfully");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#76b900]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <h1 className="text-2xl font-bold">
          {id ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="text-sm text-gray-400">Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Brand *</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Category *</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Price *</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="input mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-400">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured Product
        </label>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 border border-white/10 text-gray-300 py-2 rounded hover:border-[#76b900]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#76b900] text-black py-2 rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
