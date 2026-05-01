import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type ProductFormState = {
  name: string;
  brand: string;
  category: string;
  price: string;
  countInStock: string;
  description: string;
  featured: boolean;
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductFormState>({
    name: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
    description: "",
    featured: false,
  });

  type ImageType = {
    url: string;
    public_id: string;
  };

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);

  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");

  // 🔹 Load product (EDIT mode)
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;

        setForm({
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          countInStock: p.countInStock,
          description: p.description,
          featured: p.featured,
        });

        // Normalize images: old products may have plain strings instead of {url, public_id} objects
        const normalizedImages = (p.images || []).map((img: string | { url: string; public_id: string }) =>
          typeof img === "string"
            ? { url: img, public_id: `legacy-${img}` }
            : img
        );
        setPreview(normalizedImages);
      } catch {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get("/products/meta");
        setBrands(res.data.brands.filter((b: string) => b !== "All"));
        setCategories(res.data.categories.filter((c: string) => c !== "All"));
      } catch {
        toast.error("Failed to load options");
      }
    };

    fetchMeta();
  }, []);

  // 🔹 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // 🔹 Handle image upload
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (preview.length + files.length > 6) {
      toast.error("Max 6 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      public_id: "temp-" + Math.random(),
    }));

    setPreview((prev) => [...prev, ...previews]);
  };

  useEffect(() => {
    return () => {
      preview.forEach((img) => {
        if (img.public_id.startsWith("temp-")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [preview]);

  const handleDeleteImage = async (img: ImageType) => {
    try {
      if (img.public_id.startsWith("temp-")) {
        const idx = preview.findIndex(p => p.public_id === img.public_id);
        const existingCount = preview.filter(p => !p.public_id.startsWith("temp-")).length;
        setPreview(prev => prev.filter(p => p.public_id !== img.public_id));
        setImages(prev => prev.filter((_, i) => i !== idx - existingCount));
        return;
      }

      await api.patch(`/products/${id}/image`, {
        public_id: img.public_id,
      });

      setPreview((prev) => prev.filter((p) => p.public_id !== img.public_id));

      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.brand ||
      !form.category ||
      !form.price ||
      form.countInStock === ""
    ) {
      toast.error("Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "price" || key === "countInStock") {
          formData.append(key, String(Number(value)));
        } else {
          formData.append(key, String(value));
        }
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      if (id) {
        await api.put(`/products/${id}`, formData);
        toast.success("Product updated");
      } else {
        await api.post("/products", formData);
        toast.success("Product created");
      }

      navigate("/admin/products");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to save product";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-gray-400 hover:text-[#76b900]"
        >
          <ArrowLeft />
        </button>

        <h1 className="text-2xl font-bold">
          {id ? "Edit Product" : "Add Product"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-6 grid gap-4"
      >
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="input"
        />

        <select
          value={form.brand}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, brand: e.target.value }))
          }
          className="input"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            placeholder="Add new brand"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            className="input flex-1"
          />
          <button
            type="button"
            onClick={() => {
              const value = newBrand.trim();
              if (!value) return;

              if (brands.includes(value)) {
                toast.error("Brand already exists");
                return;
              }

              setBrands((prev) => [...prev, value]);
              setForm((prev) => ({ ...prev, brand: value }));
              setNewBrand("");
            }}
            className="px-3 bg-[#76b900] text-black rounded"
          >
            Add
          </button>
        </div>

        <select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, category: e.target.value }))
          }
          className="input"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="input flex-1"
          />
          <button
            type="button"
            onClick={() => {
              const value = newCategory.trim();
              if (!value) return;

              if (categories.includes(value)) {
                toast.error("Category already exists");
                return;
              }

              setCategories((prev) => [...prev, value]);
              setForm((prev) => ({ ...prev, category: value }));
              setNewCategory("");
            }}
            className="px-3 bg-[#76b900] text-black rounded"
          >
            Add
          </button>
        </div>

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input"
        />

        <input
          name="countInStock"
          type="number"
          placeholder="Stock"
          value={form.countInStock}
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input"
        />

        {/* Image Upload */}
        <input type="file" multiple accept="image/*" onChange={handleImages} className="input" />

        {/* Preview */}
        <div className="flex gap-2 flex-wrap">
          {preview.map((img, i) => (
            <div key={i} className="relative">
              <img src={img.url} className="w-20 h-20 object-cover rounded" />

              <button
                type="button"
                onClick={() => handleDeleteImage(img)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#76b900] text-black py-2 rounded"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
