import { Link } from "react-router-dom";
import { motion} from "framer-motion";
import type { Variants } from "framer-motion";

/* ─── Variants ────────────────────────────────────────────────────── */

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const child: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ─── HeroSection ─────────────────────────────────────────────────── */

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505] text-white">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-[#050505]" />

      {/* Soft glow — breathing pulse */}
      <motion.div
        className="absolute top-1/3 right-[-20%] w-[700px] h-[700px] bg-primary/10 blur-[120px] rounded-full"
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT — staggered entrance ── */}
          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >

            <motion.div variants={child} className="flex items-center gap-3">
              <div className="w-8 h-px bg-primary/60" />
              <span className="text-xs tracking-[0.25em] text-gray-400 uppercase">
                Next-Gen Gaming Hardware
              </span>
            </motion.div>

            <motion.h1
              variants={child}
              className="text-6xl sm:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              BUILD
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px rgba(118,185,0,0.6)",
                  color: "transparent",
                }}
              >
                YOUR
              </span>
              <br />
              <span className="text-primary">BEAST.</span>
            </motion.h1>

            <motion.p
              variants={child}
              className="text-gray-400 text-lg max-w-md"
            >
              Precision-engineered rigs for players who refuse to compromise on
              performance, thermals, or silence.
            </motion.p>

            <motion.div variants={child} className="flex gap-4">

              {/* Primary CTA — shine sweep on hover */}
              <Link
                to="/products"
                className="group relative overflow-hidden bg-primary text-black px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primaryDark transition-colors"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                  Explore Builds →
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </Link>

              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-xl border border-white/10 text-gray-300 transition-all duration-300 hover:text-white hover:border-primary/40 hover:bg-white/[0.03]"
              >
                Custom Build
              </Link>

            </motion.div>

           

          </motion.div>

          {/* ── RIGHT — floating card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Slow vertical float */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(118,185,0,0.04), 0 32px 64px -16px rgba(0,0,0,0.7)",
                }}
              >

                {/* Subtle edge glow — pulses gently */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ boxShadow: "0 0 40px -8px rgba(118,185,0,0.12)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="flex justify-between mb-6">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Signature Build
                  </span>
                  <motion.span
                    className="text-xs text-primary flex items-center gap-1.5"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    In Stock
                  </motion.span>
                </div>

                <h2 className="text-2xl font-semibold mb-4">Apex Elite</h2>

                <p className="text-sm text-gray-400 mb-6">
                  RTX 5090 · Ryzen 9 · 64GB DDR5
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {["RTX 5090", "Ryzen 9", "64GB"].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.015, borderColor: "rgba(118,185,0,0.4)" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="text-center rounded-lg bg-primary/5 border border-primary/20 py-3 text-sm cursor-default"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Starting at</p>
                    <p className="text-2xl font-semibold text-primary">₹4,89,900</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015, borderColor: "rgba(118,185,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="px-5 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    View Details
                  </motion.button>
                </div>

              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;