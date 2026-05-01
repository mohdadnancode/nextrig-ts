import { Menu, LogOut, Home } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../../context/Auth/useAuth";
import ConfirmModal from "../../components/ConfirmModal";

/* ---------------- Types ---------------- */

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
};

/* ---------------- Component ---------------- */

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const confirmLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setConfirmOpen(false);
    navigate("/login");
  };

  // Resolve title — also handle sub-paths like /admin/products/new
  const pageTitle =
    titles[pathname] ??
    (pathname.startsWith("/admin/products") ? "Products" : "Admin");

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-4 md:px-6">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/15 transition"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-base font-semibold text-gray-100 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {/* Visit store */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary px-2.5 py-1.5 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/[0.04] transition-all"
          >
            <Home size={13} />
            Store
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-xs font-bold">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.username?.[0]?.toUpperCase() ?? "A"
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-200 leading-none">
                {user?.username}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Administrator</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/[0.06] flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:border-red-500/30 transition"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <ConfirmModal
        open={confirmOpen}
        title="Logout?"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        danger
        onConfirm={confirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default AdminNavbar;
