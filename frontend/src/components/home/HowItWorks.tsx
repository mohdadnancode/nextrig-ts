import { Monitor, Wrench, Truck } from "lucide-react";
import type { JSX } from "react";

/* ------------------ Types ------------------ */

type Step = {
  icon: JSX.Element;
  title: string;
  desc: string;
};

/* ------------------ Component ------------------ */

const HowItWorks = () => {
  const steps: Step[] = [
    {
      icon: <Monitor className="w-8 h-8 text-primary" />,
      title: "Pick Your Build",
      desc: "Choose a pre-optimized setup or customize one based on your games and workload.",
    },
    {
      icon: <Wrench className="w-8 h-8 text-primary" />,
      title: "We Assemble & Test",
      desc: "Our technicians build, cable-manage, and stress-test every rig to ensure perfection.",
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Delivered Ready to Game",
      desc: "Plug in, power on, and start gaming instantly — no setup headache, no bloatware.",
    },
  ];

  return (
    <section className="border-t border-white/5 py-20 bg-linear-to-b from-black/0 via-black/40 to-black/80">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Simple Process
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative group bg-black/40 border border-white/10 p-8 rounded-2xl hover:bg-black/70 transition-all"
            >
              <div className="flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>

              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 w-2 h-2 bg-[#76b900] rounded-full group-hover:scale-150 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
