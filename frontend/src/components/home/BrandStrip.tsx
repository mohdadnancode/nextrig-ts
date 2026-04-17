import { useEffect, useRef, useState } from "react";

import razer from "../../assets/images/brands/razer1.svg";
import logitech from "../../assets/images/brands/logitech.svg";
import nvidia from "../../assets/images/brands/NVIDIA-logo.webp";
import amd from "../../assets/images/brands/amd.webp";
import msi from "../../assets/images/brands/msii-logo.webp";
import rog from "../../assets/images/brands/rog-logo.webp";

/* ------------------ Types ------------------ */

type Brand = {
  name: string;
  logo: string;
};

/* ------------------ Data ------------------ */

const TRUSTED_BRANDS: Brand[] = [
  { name: "NVIDIA", logo: nvidia },
  { name: "AMD", logo: amd },
  { name: "MSI", logo: msi },
  { name: "ROG", logo: rog },
  { name: "Razer", logo: razer },
  { name: "Logitech", logo: logitech },
];

/* ------------------ Component ------------------ */

const BrandStrip = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollAmountRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const speed = 0.4;
    let animationId: number;

    const scroll = () => {
      if (scrollContainer && !isPaused) {
        scrollAmountRef.current += speed;

        if (scrollAmountRef.current >= scrollContainer.scrollWidth / 2) {
          scrollAmountRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollAmountRef.current;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="bg-[#0d0d0d] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
              Trusted Brands
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-gray-100">
              Gear from the world’s top performance brands
            </h2>
          </div>
          <span className="hidden lg:block h-px flex-1 lg:ml-8 bg-linear-to-r from-[#76b900] to-transparent" />
        </div>

        {/* Marquee */}
        <div
          ref={scrollRef}
          className="flex gap-12 overflow-x-hidden whitespace-nowrap border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl px-8 py-6 relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...TRUSTED_BRANDS, ...TRUSTED_BRANDS].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="shrink-0 flex items-center justify-center w-36 sm:w-44 transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 sm:h-12 object-contain opacity-70 grayscale hover:opacity-100 hover:grayscale-0 hover:brightness-125 transition-all duration-300"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(118,185,0,0))",
                }}
                onMouseEnter={(e) => {
                  setIsPaused(true);
                  e.currentTarget.style.filter =
                    "drop-shadow(0 0 10px rgba(118,185,0,0.9))";
                }}
                onMouseLeave={(e) => {
                  setIsPaused(false);
                  e.currentTarget.style.filter =
                    "drop-shadow(0 0 4px rgba(118,185,0,0))";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;
