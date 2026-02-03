import { useState, useEffect } from "react";
import type { ReactNode } from "react";
// import { LogOut } from "lucide-react";
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

  const isActive = (path: string): boolean =>
    location.pathname === path;

  const handleLogout = (): void => {
    logout();
    toast.success("Logged out. See you next time! 👋");
    setShowDropdown(false);
    setMenuOpen(false);
    navigate("/");
  };

  if (authLoading) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-[#0d0d0d] h-16 flex items-center justify-center text-[#76b900]">
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/5 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-white/10 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#76b900] hover:opacity-80 transition-opacity hover:drop-shadow-[0_0_10px_#76b900]"
        >
          NextRig
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors group ${
                isActive(link.path)
                  ? "text-[#76b900]"
                  : "text-gray-300 hover:text-[#76b900]"
              }`}
            >
              <div className="flex items-center gap-2">
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="bg-[#76b900] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                )}
              </div>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#76b900] transition-all duration-300 ${
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
                className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-[#76b900] transition-colors group"
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
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-[#76b900] transition-colors"
                  >
                    <i className="fas fa-user w-4"></i> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-[#76b900] transition-colors"
                  >
                    <i className="fas fa-shopping-bag w-4"></i> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-[#76b900] transition-colors"
                  >
                    <i className="fas fa-heart w-4"></i> Wishlist{" "}
                    {wishlistCount > 0 && (
                      <span className="ml-2 bg-[#76b900] text-black text-xs rounded-full px-1.5">
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
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`relative text-sm font-medium transition-colors group ${
                isActive("/login") || isActive("/register")
                  ? "text-[#76b900]"
                  : "text-gray-300 hover:text-[#76b900]"
              }`}
            >
              <i className="fas fa-sign-in-alt mr-1"></i> Login
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#76b900] transition-all duration-300 ${
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
          <Link to="/cart" className="relative text-gray-300 hover:text-[#76b900]">
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#76b900] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-[#76b900] text-2xl"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden bg-[#0d0d0d] border-t border-white/10 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4 text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-lg font-medium ${
                isActive(link.path)
                  ? "text-[#76b900]"
                  : "hover:text-[#76b900]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                Wishlist ({wishlistCount})
              </Link>
              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;