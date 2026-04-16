import React from "react";
import { Cpu, Users, Award, Shield, type LucideIcon } from "lucide-react";
import RevealOnScroll from "../../components/ui/RevealOnScroll";

/* ---------------- Types ---------------- */

type ValueItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

/* ---------------- Component ---------------- */

const About: React.FC = () => {
  const values: ValueItem[] = [
    {
      icon: Cpu,
      title: "Performance Obsessed",
      desc: "Every build we make is optimized, benchmarked, and tested for maximum real-world FPS — not just flashy specs.",
    },
    {
      icon: Users,
      title: "Built by Gamers",
      desc: "We're gamers and tech nerds first. We understand what matters — stability, thermals, and that extra frame advantage.",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      desc: "Every part is genuine, warranty-backed, and clearly listed. No fake pricing or hidden components. Ever.",
    },
    {
      icon: Award,
      title: "Customer First",
      desc: "We're known for fast support, real humans answering, and going beyond expectations with post-build assistance.",
    },
  ];

  return (
    <div className="bg-black text-gray-100">
      {/* Hero Banner */}
      <section className="relative py-24 border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Who We Are
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              About <span className="text-primary">NextRig</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              NextRig was born out of frustration with overpriced prebuilt PCs
              and lazy configurations. We decided to change the game —
              literally.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-white/5 bg-linear-to-b from-black/0 via-black/30 to-black/70">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <RevealOnScroll delay={0.1}>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We exist to make high-performance gaming PCs accessible and
                transparent for everyone.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/50">
              <img
                src="https://images.unsplash.com/photo-1612197527762-9a2e8e62a4de?auto=format&fit=crop&w=800&q=80"
                alt="Custom PC build"
                className="w-full h-80 object-cover"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-b border-white/5 bg-linear-to-b from-black/0 via-black/40 to-black/80">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-semibold mb-12">
              The Core Behind Our Builds
            </h2>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map(({ icon: Icon, title, desc }) => (
              <RevealOnScroll key={title}>
                <div className="border border-white/10 rounded-2xl bg-black/40 p-8">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-16 text-center">
        <RevealOnScroll>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to Get Your Dream Rig?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Check out our builds or reach out to create a fully custom setup.
          </p>
          <a
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#76b900] text-black font-medium text-sm shadow-[0_0_35px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Explore Builds
          </a>
        </RevealOnScroll>
      </section>
    </div>
  );
};

export default About;
