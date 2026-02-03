import { Zap, DollarSign, Wrench } from "lucide-react";
import type { JSX } from "react";

/* ------------------ Types ------------------ */

type WhyPoint = {
  title: string;
  desc: string;
  icon: JSX.Element;
};

/* ------------------ Component ------------------ */

const WhyNextRig = () => {
  const points: WhyPoint[] = [
    {
      title: "Performance-First Builds",
      desc: "Every rig is tuned for real-world performance — not just flashy specs. FPS, temps, and stability come first.",
      icon: (
        <Zap className="w-10 h-10 text-[#76b900] group-hover:scale-110 transition-transform duration-300" />
      ),
    },
    {
      title: "Transparent Pricing",
      desc: "No overpriced prebuilds or hidden markups. Every component and cost is clearly listed before checkout.",
      icon: (
        <DollarSign className="w-10 h-10 text-[#76b900] group-hover:scale-110 transition-transform duration-300" />
      ),
    },
    {
      title: "Lifetime Support",
      desc: "Our experts are gamers too. We'll help you troubleshoot, upgrade, or optimize — even years after purchase.",
      icon: (
        <Wrench className="w-10 h-10 text-[#76b900] group-hover:scale-110 transition-transform duration-300" />
      ),
    },
  ];

  return (
    <section className="border-t border-white/5 py-20 bg-linear-to-b from-black/0 via-black/30 to-black/70">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
          Why Choose Us
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-12">
          Why <span className="text-[#76b900]">NextRig</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {points.map((p, i) => (
            <div
              key={i}
              className="group border border-white/10 rounded-2xl p-8 bg-black/40 hover:bg-black/60 hover:border-[#76b900]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(118,185,0,0.3)]"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#76b900]/10 border border-[#76b900]/20">
                  {p.icon}
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-100 mb-2 group-hover:text-[#76b900] transition-colors">
                {p.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyNextRig;
