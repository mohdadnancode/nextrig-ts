import {
  ShoppingCart,
  Cpu,
  Zap,
  Gauge,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import rtx5090 from "../../assets/images/rtx5090.webp";
import { useEffect, useState } from "react";
import api from "../../api/client";

/* ------------------ Types ------------------ */

type SpecItem = {
  icon: LucideIcon;
  label: string;
};

type GPUShowcaseProps = {
  model?: string;
  tagline?: string;
  description?: string;
  learnMore?: string;
  specs?: SpecItem[];
  productId?: string;
};


/* ------------------ Component ------------------ */

const GPUShowcase = ({
  model = "NVIDIA RTX 5090",
  tagline = "Unleashing the Future",
  description =
    "Powered by Ada Lovelace Gen-3 architecture, redefining next-gen gaming and creative workflows.",
  learnMore =
    "https://www.nvidia.com/en-in/geforce/graphics-cards/50-series/rtx-5090/",
  specs = [
    { icon: Cpu, label: "Ada Lovelace Gen-3 GPU" },
    { icon: Gauge, label: "32 GB GDDR7 Memory" },
    { icon: Zap, label: "DLSS 4 + Ray Reconstruction" },
    { icon: Thermometer, label: "600 W TDP Optimized" },
  ],
}: GPUShowcaseProps) => {
  const [brand, ...rest] = model.split(" ");
  const modelName = rest.join(" ");

  const [productId, setProductId] = useState("");

useEffect(() => {
  const fetchGPU = async () => {
    const res = await api.get("/products", {
      params: { search: "RTX 5090", limit: 1 }
    });

    if (res.data.products.length > 0) {
      setProductId(res.data.products[0]._id);
    }
  };

  fetchGPU();
}, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden border-b border-white/10">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-position-[center_top_-2rem] bg-no-repeat animate-parallax"
        style={{
          backgroundImage: `url(${rtx5090})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center"
      >
        {/* Tagline */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-xs uppercase tracking-[0.3em] text-primary mb-2"
        >
          {tagline}
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-4xl md:text-6xl font-semibold text-gray-100 mb-4 leading-tight glow-text"
        >
          {brand} <span className="text-primary">{modelName}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-gray-300 max-w-xl text-sm md:text-base mb-6"
        >
          {description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to={productId ? `/products/${productId}` : "/products"}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#76b900] text-black font-medium text-sm glow-btn transition-transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Link>

          <a
            href={learnMore}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:border-[#76b900] hover:text-primary font-medium text-sm transition"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Specs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_0_25px_rgba(118,185,0,0.15)] animate-float max-w-55 sm:max-w-none"
      >
        <h3 className="text-primary font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">
          Key Specs
        </h3>
        <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
          {specs.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                {s.label}
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes parallaxZoom {
          0%, 100% { transform: scale(1.04); }
          60% { transform: scale(1.08) translateY(-10px); }
        }

        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(118,185,0,0.3);
          }
          50% {
            text-shadow: 0 0 25px rgba(118,185,0,0.8);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-parallax {
          animation: parallaxZoom 6s ease-in-out infinite;
        }

        .glow-text {
          animation: glowPulse 3s ease-in-out infinite;
        }

        .glow-btn {
          box-shadow: 0 0 20px rgba(118,185,0,0.4);
          transition: box-shadow 0.3s ease;
        }

        .glow-btn:hover {
          box-shadow: 0 0 40px rgba(118,185,0,0.9);
        }
      `}</style>
    </section>
  );
};

export default GPUShowcase;