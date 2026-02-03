import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="
        relative
        min-h-[70vh]
        md:min-h-screen
        bg-[#0d0d0d]
        text-white
        pt-20
        overflow-hidden
      "
    >
      <div className="absolute inset-0 bg-linear-to-br from-black via-[#0d0d0d] to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gray-400">
              <span className="hidden sm:block h-px w-10 bg-[#76b900]/60" />
              NextRig
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Build Your Next Gaming Rig
              <Zap
                size={36}
                strokeWidth={2.2}
                className="inline-block align-middle ml-2 text-[#76b900]"
              />
            </h1>

            <div className="h-0.5 w-40 bg-linear-to-r from-[#76b900] to-transparent mx-auto lg:mx-0" />

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0">
              High-performance PCs and components built for gamers who
              care about real-world performance, thermals, and stability.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="
                  inline-flex items-center justify-center
                  rounded-xl
                  bg-[#76b900]
                  text-black
                  font-semibold
                  px-8 py-3
                  hover:scale-[1.03]
                  transition-transform
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#76b900]/60
                "
              >
                Shop Now
              </Link>

              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300">
                Free shipping · 24/7 build support
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">
                Signature Build
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
                RTX 5090 · Gen5 Ryzen · NVMe 4TB
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Avg FPS", value: "240+" },
                  { label: "Thermals", value: "Cool & Quiet" },
                  { label: "Warranty", value: "2 Years" },
                  { label: "Support", value: "24/7" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400">
                Performance-first builds engineered for stability,
                efficiency, and consistent gaming workloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
