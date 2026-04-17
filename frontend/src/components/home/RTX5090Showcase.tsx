import {
  ShoppingCart,
  Cpu,
  Zap,
  Gauge,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import rtx5090 from "../../assets/images/rtx5090.webp";

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
  return (
    <section className="relative w-full h-[90vh] overflow-hidden border-b border-white/10">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-position-[center_top_-2rem] bg-no-repeat animate-parallax"
        style={{
          backgroundImage: `url(${rtx5090})`,
          filter: "brightness(0.6)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black/90" />

      {/* Content */}
       <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
          {tagline}
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold text-gray-100 mb-4 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {model.split(" ")[0]}{" "}
          <span className="text-primary">
            {model.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        <p className="text-gray-300 max-w-xl text-sm md:text-base mb-6">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#76b900] text-black font-medium text-sm shadow-[0_0_25px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.85)] transition-transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Link>

          <a
            href={learnMore}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:border-[#76b900] hover:text-primary font-medium text-sm transition"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Specs */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_0_25px_rgba(118,185,0,0.15)] animate-float max-w-55 sm:max-w-none">
        <h3 className="text-primary font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">
          Key Specs
        </h3>
        <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
          {specs.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={i} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />{" "}
                {s.label}
              </li>
            );
          })}
        </ul>
      </div>

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

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-parallax {
          animation: parallaxZoom 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default GPUShowcase;
