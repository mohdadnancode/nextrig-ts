import { useEffect, useState, useCallback } from "react";
import api from "../../api/client";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { AdminUser } from "../../types/adminUser";

// Local sub-types
type StatCardProps = {
  label: string;
  value: number | string;
  accent?: boolean;
};

type InfoBoxProps = {
  label: string;
  value: string | number;
};

type StatusBadgeProps = {
  isBlocked: boolean;
};

// Helpers
const fmt = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Sub-components
const StatCard = ({ label, value, accent = false }: StatCardProps) => (
  <div
    className={`
      rounded-xl p-4 border transition-all duration-200
      ${
        accent
          ? "bg-gradient-to-br from-[#76b900]/20 to-[#76b900]/5 border-[#76b900]/40 shadow-[0_0_20px_rgba(118,185,0,0.08)]"
          : "bg-[#0b0b0b] border-white/10 hover:border-white/20"
      }
    `}
  >
    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-2xl font-bold ${accent ? "text-[#76b900]" : "text-white"}`}
    >
      {value}
    </p>
  </div>
);

const InfoBox = ({ label, value }: InfoBoxProps) => (
  <div className="border border-white/10 rounded-lg p-3 bg-white/[0.02]">
    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">
      {label}
    </p>
    <p className="font-semibold text-white text-sm">{value}</p>
  </div>
);

const StatusBadge = ({ isBlocked }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
      isBlocked
        ? "bg-red-500/15 text-red-400 border border-red-500/20"
        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-red-400" : "bg-emerald-400"}`}
    />
    {isBlocked ? "Blocked" : "Active"}
  </span>
);

const AdminBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
    Admin
  </span>
);

const Avatar = ({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "lg";
}) => {
  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#76b900]/30 to-[#76b900]/10 border border-[#76b900]/20 text-[#76b900] flex items-center justify-center font-bold shrink-0`}
    >
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
};

// Empty state
const EmptyState = ({ search }: { search: string }) => (
  <tr>
    <td colSpan={6} className="py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">
          {search ? "🔍" : "👥"}
        </div>
        <p className="text-gray-400 font-medium">
          {search ? `No users match "${search}"` : "No users found"}
        </p>
        {search && (
          <p className="text-gray-600 text-sm">Try a different name or email</p>
        )}
      </div>
    </td>
  </tr>
);

// Main component

const Users = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [blockTarget, setBlockTarget] = useState<AdminUser | null>(null);
  const [blockLoading, setBlockLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get<{
        users: AdminUser[];
        page: number;
        pages: number;
        total: number;
      }>("/admin/users");

      setUsers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      return;
    }
    const q = search.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  // Block toggle
  const handleToggleBlock = async () => {
    if (!blockTarget) return;
    setBlockLoading(true);
    try {
      await api.patch(`/admin/users/${blockTarget._id}/block`);
      toast.success(
        `User ${blockTarget.isBlocked ? "unblocked" : "blocked"} successfully`,
      );
      setBlockTarget(null);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setBlockLoading(false);
    }
  };

  // Stats (derived from already-fetched list)
  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const usersWithOrders = users.filter((u) => u.orderCount > 0).length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage registered users
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full bg-[#0b0b0b] border border-white/10 focus:border-[#76b900]/50 focus:outline-none rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Blocked" value={blockedUsers} />
        <StatCard label="With Orders" value={usersWithOrders} accent />
      </div>

      {/* TABLE */}
      <div className="bg-[#0b0b0b] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  "User",
                  "Email",
                  "Status",
                  "Orders",
                  "Total Spent",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${
                      h === "Actions" ? "text-center" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <EmptyState search={search} />
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-white/[0.03] transition-colors duration-150 group"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.username} />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">
                            {u.username}
                          </p>
                          {u.role === "admin" && <AdminBadge />}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-400 truncate max-w-[200px]">
                      {u.email}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge isBlocked={u.isBlocked} />
                    </td>

                    {/* Orders */}
                    <td className="px-4 py-3 text-gray-300 tabular-nums">
                      {u.orderCount ?? 0}
                    </td>

                    {/* Total Spent */}
                    <td className="px-4 py-3 font-semibold text-[#76b900] tabular-nums">
                      ₹{fmt(u.totalSpent ?? 0)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {u.role === "admin" ? (
                        <div className="flex justify-center">
                          <AdminBadge />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => setBlockTarget(u)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium w-20 transition-all duration-150 border ${
                              u.isBlocked
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                            }`}
                          >
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>

                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#76b900]/10 text-[#76b900] border border-[#76b900]/20 hover:bg-[#76b900]/20 transition-all duration-150"
                          >
                            View
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Row count */}
        {filteredUsers.length > 0 && (
          <div className="px-4 py-2 border-t border-white/5 text-xs text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-sm"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={selectedUser.username} size="lg" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedUser.username}
                </h2>
                <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                <div className="mt-1">
                  <StatusBadge isBlocked={selectedUser.isBlocked} />
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <InfoBox label="Role" value={selectedUser.role} />
              <InfoBox label="Orders" value={selectedUser.orderCount} />
              <InfoBox
                label="Total Spent"
                value={`₹${fmt(selectedUser.totalSpent)}`}
              />
              <InfoBox
                label="Member Since"
                value={new Date(selectedUser.createdAt).toLocaleDateString(
                  "en-IN",
                  { day: "2-digit", month: "short", year: "numeric" },
                )}
              />
            </div>

            {/* Addresses */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Saved Addresses
              </h3>
              {selectedUser.addresses?.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedUser.addresses.map((addr, i) => (
                    <div
                      key={i}
                      className="border border-white/10 rounded-lg p-3 text-sm text-gray-300 bg-white/[0.02]"
                    >
                      <p className="font-medium text-white">{addr.fullName}</p>
                      <p>{addr.address}</p>
                      <p>
                        {addr.city} – {addr.pincode}
                      </p>
                      {addr.mobileNumber && (
                        <p className="text-gray-500 text-xs mt-1">
                          📞 {addr.mobileNumber}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No addresses saved</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BLOCK CONFIRM MODAL */}
      {blockTarget && (
        <ConfirmModal
          open={true}
          title={`${blockTarget.isBlocked ? "Unblock" : "Block"} User`}
          confirmText={
            blockLoading
              ? "Updating…"
              : blockTarget.isBlocked
                ? "Unblock"
                : "Block"
          }
          cancelText="Cancel"
          onConfirm={handleToggleBlock}
          onCancel={() => setBlockTarget(null)}
          message={`Are you sure you want to ${
            blockTarget.isBlocked ? "unblock" : "block"
          } ${blockTarget.username}? ${
            blockTarget.isBlocked
              ? "They will regain access to their account."
              : "They will be unable to log in."
          }`}
        />
      )}
    </div>
  );
};

export default Users;
