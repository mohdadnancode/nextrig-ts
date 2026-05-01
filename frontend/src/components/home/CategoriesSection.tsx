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

/* ------------------ Category Images Map ------------------ */

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
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get<{ categories: string[] }>(
          "/products/meta"
        );
        const filtered = (data.categories || []).filter(
          (c) => c !== "All" && c !== "test"
        );
        setCategories(filtered.slice(0, 20));
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0d0d0d] py-12 text-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="bg-[#0d0d0d] text-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-1">
              Shop by Category
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              Find gear that matches your playstyle
            </h2>
          </div>
          <span className="hidden sm:block h-px flex-1 bg-gradient-to-r from-[#76b900]/50 to-transparent" />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {categories.map((category, i) => {
            const image = categoryImages[category] || gpu;
            return (
              <button
                key={category}
                onClick={() =>
                  navigate(
                    `/products?category=${encodeURIComponent(category)}`
                  )
                }
                className="group flex flex-col items-center gap-2 p-2 rounded-xl border border-transparent hover:border-primary/25 hover:bg-white/[0.03] transition-all duration-200 opacity-0 animate-fadeUp"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Image circle */}
                <div className="relative w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(118,185,0,0.15)] overflow-hidden transition-all duration-300">
                  <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Subtle green overlay on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                </div>

                {/* Label */}
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary leading-tight text-center transition-colors duration-200 line-clamp-1">
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
