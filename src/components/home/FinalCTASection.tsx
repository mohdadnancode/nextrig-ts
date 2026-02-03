import { Link } from "react-router-dom";

const FinalCTASection = () => {
  return (
    <section className="border-t border-white/5 bg-linear-to-b from-black/0 via-black/40 to-black py-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#76b900] mb-2">
            Ready when you are
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-50">
            Build the rig that actually matches your skill.
          </h2>
          <p className="text-sm text-gray-400 mt-3 max-w-xl">
            No prebuilt nonsense. Tuned configs, transparent pricing, and support from people
            who actually game.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#76b900] text-black font-medium text-sm shadow-[0_0_35px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.85)] transition-transform hover:-translate-y-0.5"
          >
            Browse all builds
          </Link>
          <Link
            to="/contact"
            className="text-sm text-gray-300 hover:text-[#76b900] transition-colors"
          >
            Need a custom spec?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
