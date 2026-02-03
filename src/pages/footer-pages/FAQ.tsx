import { useState } from "react";
import { ChevronDown } from "lucide-react";
import RevealOnScroll from "../../components/ui/RevealOnScroll";

type FAQItem = {
  q: string;
  a: string;
};

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      q: "How long does it take to build and deliver my PC?",
      a: "Typically, custom builds take 3-7 business days for assembly, testing, and shipping. We ensure each rig passes thermal and stability tests before dispatch.",
    },
    {
      q: "Do you offer warranty on your PCs?",
      a: "Yes. Every part retains its manufacturer warranty (1-3 years), and we provide lifetime build support — software help, troubleshooting, and performance optimization.",
    },
    {
      q: "Can I request specific components?",
      a: "Absolutely. You can choose parts during customization or contact us directly to discuss your preferred GPU, CPU, or case design.",
    },
    {
      q: "What if my PC arrives damaged?",
      a: "We provide full replacement or refund if the system is damaged during transit. Every shipment is insured and professionally packed.",
    },
    {
      q: "Do you ship outside India?",
      a: "Currently, we only ship across India. International orders will be introduced soon with region-specific partners.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number): void => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-black text-gray-100">
      {/* Hero Banner */}
      <section className="relative py-24 border-b border-white/10 text-center">
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
              Need Help?
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              FAQ & <span className="text-[#76b900]">Support</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Here are some of the most common questions we get about ordering, shipping,
              customization, and after-sales support.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-b border-white/5 bg-linear-to-b from-black/0 via-black/30 to-black/70">
        <div className="max-w-4xl mx-auto px-6">
          <RevealOnScroll>
            <h2 className="text-3xl font-semibold text-center mb-12">
              Frequently Asked Questions
            </h2>
          </RevealOnScroll>

          <div className="space-y-4">
            {faqs.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.05}>
                <div
                  className={`border border-white/10 rounded-xl bg-black/40 hover:bg-black/60 transition-all overflow-hidden ${
                    openIndex === i ? "border-[#76b900]/40" : ""
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-100 text-sm sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#76b900] transition-transform ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ${
                      openIndex === i ? "max-h-48 py-2 px-5" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 text-center border-t border-white/5">
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
            Still Have Questions?
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            Reach Out to Our Support Team
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Our experts are available via email and chat for build recommendations,
            troubleshooting, and order updates.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#76b900] text-black font-medium text-sm shadow-[0_0_35px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Contact Us
          </a>
        </RevealOnScroll>
      </section>
    </div>
  );
};

export default FAQ;
