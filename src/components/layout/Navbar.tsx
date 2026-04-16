import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

/* ------------------ Types ------------------ */

type NavLinkItem = {
  path: string;
  label: ReactNode;
  badge?: number;
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const isActive = (path: string): boolean => location.pathname === path;

  const handleLogout = (): void => {
    logout();
    toast.success("Logged out. See you next time! 👋");
    setShowDropdown(false);
    setMenuOpen(false);
    navigate("/");
  };

  if (authLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-[#0d0d0d] h-16 flex items-center justify-center text-primary">
        <span>Loading...</span>
      </nav>
    );
  }

  const navLinks: NavLinkItem[] = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    {
      path: "/cart",
      label: (
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-cart-shopping"></i>
          <span>Cart</span>
        </span>
      ),
      badge: cartCount,
    },
  ];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity hover:drop-shadow-[0_0_10px_#76b900]"
          >
            <span className="text-2xl font-semibold tracking-tight">
              Next<span className="text-primary">Rig</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors group ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-gray-400 hover:text-white transition-colors"
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.label}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="bg-primary/80 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-primary/80 transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}

            {/* Authenticated User */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-transparent group-hover:border-[#76b900] transition-colors overflow-hidden flex items-center justify-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span>{user.username}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-xs transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A] backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-primary transition-colors"
                      >
                        <i className="fas fa-user w-4"></i> Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-primary transition-colors"
                      >
                        <i className="fas fa-shopping-bag w-4"></i> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-primary transition-colors"
                      >
                        <i className="fas fa-heart w-4"></i> Wishlist{" "}
                        {wishlistCount > 0 && (
                          <span className="ml-2 bg-primary text-black text-xs rounded-full px-1.5">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                      <div className="border-t border-white/20 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt w-4"></i> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`relative text-sm font-medium transition-colors group ${
                  isActive("/login") || isActive("/register")
                    ? "text-primary"
                    : "text-gray-400 hover:text-white transition-colors"
                }`}
              >
                <i className="fas fa-sign-in-alt mr-1"></i> Login
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive("/login") || isActive("/register")
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              to="/cart"
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Menu Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 md:hidden"
      >
        <div className="h-full w-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl">
          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={menuOpen ? "show" : "hidden"}
            className="flex flex-col h-full px-6 py-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-lg font-semibold">
                Next<span className="text-primary">Rig</span>
              </span>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Menu
              </p>

              {navLinks.map((link) => (
                <motion.div key={link.path} variants={item}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between text-base font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-primary"
                        : "text-gray-300 hover:text-white hover:translate-x-[3px]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                    </span>

                    <div className="flex items-center gap-2">
                      {isActive(link.path) && (
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      )}

                      {link.badge && link.badge > 0 && (
                        <span className="bg-primary text-black text-xs px-2 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Account */}
            <div className="mt-auto pt-6 border-t border-white/10 space-y-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Account
              </p>

              {isAuthenticated ? (
                <>
                  {[
                    { to: "/profile", label: "Profile" },
                    { to: "/orders", label: "My Orders" },
                    { to: "/wishlist", label: `Wishlist (${wishlistCount})` },
                  ].map((itemLink) => (
                    <motion.div key={itemLink.to} variants={item}>
                      <Link
                        to={itemLink.to}
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-300 hover:text-white hover:translate-x-[3px] transition-all duration-200 block"
                      >
                        {itemLink.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div variants={item}>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 transition text-left"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={item}>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-white hover:translate-x-[3px] transition-all duration-200 block"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;