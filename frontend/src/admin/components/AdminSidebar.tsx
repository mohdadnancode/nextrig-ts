import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, X } from "lucide-react";
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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-[#0b0b0b] border-r border-[#76b900]/20
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#76b900]/20">
          <span className="text-xl font-bold text-primary">
            NextRig Admin
          </span>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-[#76b900]/20 text-primary"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
