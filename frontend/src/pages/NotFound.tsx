import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import RevealOnScroll from "../components/ui/RevealOnScroll";
import type { JSX } from "react";

const NotFound = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-gray-100 px-6">
      <RevealOnScroll>
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-[#76b900]/10 border border-[#76b900]/20">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-50">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-300">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
            Looks like you're lost in cyberspace. The page you're trying to
            reach doesn't exist, was moved, or is under construction.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/"
              className="px-6 py-3 bg-[#76b900] text-black text-sm font-semibold rounded-lg shadow-[0_0_35px_rgba(118,185,0,0.45)] hover:shadow-[0_0_45px_rgba(118,185,0,0.85)] transition-transform hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-white/20 text-gray-300 text-sm rounded-lg hover:text-primary hover:border-[#76b900] transition"
            >
              Contact Support
            </Link>
          </div>

          {/* Subtle Glow Animation */}
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 rounded-full bg-[#76b900]/40 animate-pulse" />
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default NotFound;
