import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

/* ------------------ Types ------------------ */

type Build = {
  id: number;
  name: string;
  specs: string;
  price: string;
  image: string;
  badge: string;
};

/* ------------------ Data ------------------ */

const builds: Build[] = [
  {
    id: 1,
    name: "NextRig Vortex X",
    specs: "Ryzen 7 7800X3D • RTX 4070 Ti • 32GB DDR5",
    price: "₹1,69,999",
    image: "https://m.media-amazon.com/images/I/71jELtZLEwL._SX522_.jpg",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "NextRig Nova R",
    specs: "Intel i7-13700KF • RTX 4070 Ti • 32GB DDR5",
    price: "₹1,89,999",
    image: "https://m.media-amazon.com/images/I/61UeSde3leL._AC_SX466_.jpg",
    badge: "Top Rated",
  },
  {
    id: 3,
    name: "NextRig Pulse 3050",
    specs: "Ryzen 5 7600X • RTX 3050 6GB • 32GB DDR5",
    price: "₹94,999",
    image: "https://m.media-amazon.com/images/I/81sjZtWvymL._SX522_.jpg",
    badge: "Budget King",
  },
  {
    id: 4,
    name: "NextRig Titan Z",
    specs: "Intel i9-14900K • RTX 4060 8GB • 64GB DDR5",
    price: "₹3,49,999",
    image: "https://m.media-amazon.com/images/I/71EacQrVJBL._SX679_.jpg",
    badge: "Extreme Build",
  },
];

/* ------------------ Component ------------------ */

const TopBuildsSection = () => {
  return (
    <section className="border-t border-white/5 py-20 bg-linear-to-b from-black/0 via-black/40 to-black/70">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-2">
              Featured Builds
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">
              Top Builds of the Month
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-gray-300 hover:text-[#76b900] transition-colors mt-4 sm:mt-0"
          >
            View All Builds →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {builds.map((build) => (
            <div
              key={build.id}
              className="relative bg-black/50 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#76b900]/40 transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={build.image}
                  alt={build.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#76b900]/90 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {build.badge}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-lg font-medium text-gray-100">
                  {build.name}
                </h3>
                <p className="text-sm text-gray-400">{build.specs}</p>
                <p className="text-[#76b900] font-semibold">{build.price}</p>

                <button className="mt-3 flex items-center gap-2 text-sm font-medium text-[#76b900] hover:text-[#9eff45] transition-colors">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBuildsSection;
