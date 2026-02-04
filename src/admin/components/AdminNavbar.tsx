import { Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-[#0b0b0b] border-b border-[#76b900]/20 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden">
            <Menu />
          </button>
          <h1 className="text-lg font-semibold">
            {titles[pathname] ?? "Admin"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-[#76b900]/20 border border-[#76b900]/40 flex items-center justify-center text-[#76b900] font-bold">
            {user?.username?.[0]?.toUpperCase() ?? "A"}
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Logout
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
