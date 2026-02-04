import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

/* ------------------ Images ------------------ */

import gpu from "../../assets/images/products/gpu.webp";
import cpu from "../../assets/images/products/cpu.webp";
import consoleImg from "../../assets/images/products/console.webp";
import ram from "../../assets/images/products/ram.webp";
import storage from "../../assets/images/products/ssd.webp";
import motherboard from "../../assets/images/products/motherboard.webp";
import handheld from "../../assets/images/products/handheld.webp";
import cooler from "../../assets/images/products/cooler.webp";
import powersupply from "../../assets/images/products/powersupply.webp";
import pcCase from "../../assets/images/products/case.webp";
import monitor from "../../assets/images/products/monitor.webp";
import mouse from "../../assets/images/products/mouse.webp";
import keyboard from "../../assets/images/products/keyboard.webp";
import headset from "../../assets/images/products/headset.webp";
import microphone from "../../assets/images/products/microphone.webp";
import laptop from "../../assets/images/products/laptop.webp";
import accessory from "../../assets/images/products/accessory.webp";

/* ------------------ Types ------------------ */

type Product = {
  category?: string;
};

type Category = string;

/* ------------------ Category Images ------------------ */

const categoryImages: Record<string, string> = {
  GPU: gpu,
  CPU: cpu,
  "Gaming Console": consoleImg,
  RAM: ram,
  Storage: storage,
  Motherboard: motherboard,
  Handheld: handheld,
  "Cooling System": cooler,
  "Power Supply": powersupply,
  "PC Case": pcCase,
  Monitor: monitor,
  Mouse: mouse,
  Keyboard: keyboard,
  Headset: headset,
  Microphone: microphone,
  Laptop: laptop,
  Accessory: accessory,
};

/* ------------------ Component ------------------ */

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        setLoading(true);

        const { data } = await api.get<Product[]>("/products");

        const uniqueCategories: Category[] = [
          ...new Set(data.map((p) => p.category).filter(Boolean)),
        ] as Category[];

        const shuffled = uniqueCategories.sort(() => Math.random() - 0.5);

        setCategories(shuffled.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category): void => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  /* ------------------ States ------------------ */

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] text-white py-16 text-center">
        <p className="text-[#76b900] text-lg animate-pulse">
          Loading categories...
        </p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="bg-[#0d0d0d] text-gray-400 py-16 text-center">
        No categories found
      </div>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <section className="bg-[#0d0d0d] text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Shop by Category
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-gray-100">
              Find gear that matches your playstyle
            </h2>
          </div>
          <span className="hidden sm:block h-px flex-1 sm:ml-8 bg-linear-to-r from-[#76b900] to-transparent" />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {categories.map((category, index) => {
            const image = categoryImages[category] || gpu; // fallback
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center text-center cursor-pointer opacity-0 animate-fadeUp hover:scale-110 transition-all duration-300"
                style={{
                  animationDelay: `${index * 120}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#76b900]/40 bg-white/5 backdrop-blur-md shadow-inner flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_#76b90055]">
                  <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border border-[#76b900]/40 group-hover:border-[#76b900] transition-all duration-300" />
                </div>
                <p className="mt-3 text-gray-200 font-medium text-sm sm:text-base group-hover:text-[#76b900] transition-colors duration-200">
                  {category}
                </p>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#76b900] text-[#76b900] hover:bg-[#76b900] hover:text-black font-semibold rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(118,185,0,0.3)]"
          >
            View All Products
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
