import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  Home,
  ExternalLink,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { LucideIcon } from "lucide-react";

/* ---------------- Types ---------------- */

interface AdminSidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

type AdminLink = {
  name: string;
  path: string;
  icon: LucideIcon;
};

/* ---------------- Data ---------------- */

const links: AdminLink[] = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Users", path: "/admin/users", icon: Users },
];

/* ---------------- Component ---------------- */

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-white/[0.07]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.07] shrink-0">
          <Link to="/admin" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-primary" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Next<span className="text-primary">Rig</span>
              <span className="text-[10px] font-medium text-gray-500 ml-1.5 uppercase tracking-widest">
                Admin
              </span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Management
          </p>

          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/15"
                    : "text-gray-400 border border-transparent hover:bg-white/[0.04] hover:text-gray-200"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* Footer — Back to Store */}
        <div className="px-3 pb-4 pt-2 border-t border-white/[0.07] shrink-0">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-primary hover:bg-primary/[0.05] transition-all duration-200 group"
          >
            <Home size={17} />
            <span className="flex-1">Back to Store</span>
            <ExternalLink
              size={13}
              className="text-gray-600 group-hover:text-primary/60 transition"
            />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
