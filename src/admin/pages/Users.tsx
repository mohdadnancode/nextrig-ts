import { useEffect, useState } from "react";
import api from "../../api/client";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import type { User } from "../../types/user";

type StatCardProps = {
  label: string;
  value: number;
};

type InfoBoxProps = {
  label: string;
  value: string | number;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blockTarget, setBlockTarget] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
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

  /* ================= HELPERS ================= */
  const isAdminUser = (user: User): boolean => user.role === "admin";

  const getTotalSpent = (user: User): number => {
    if (!Array.isArray(user.orders)) return 0;

    return user.orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => {
        // if (order.total != null) {
        //   return sum + Number(order.total);
        // }

        if (order.totalAmount != null) {
          return sum + Number(order.totalAmount);
        }
        if (Array.isArray(order.items)) {
          const itemsTotal = order.items.reduce(
            (iSum, item) =>
              iSum + Number(item.price || 0) * Number(item.quantity || 0),
            0,
          );

          return sum + itemsTotal;
        }
        return sum;
      }, 0);
  };

  const getRecentOrders = (user: User, limit = 5) => {
    if (!Array.isArray(user.orders)) return [];

    return [...user.orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  /* ================= STATS ================= */
  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const usersWithOrders = users.filter(
    (u) => (u.orders?.length || 0) > 0,
  ).length;

  if (loading) {
    return <p className="text-gray-400">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-400 text-sm">Manage registered users</p>
        </div>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="bg-black border border-white/20 rounded px-3 py-2 text-white w-full sm:w-64"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Blocked" value={blockedUsers} />
        <StatCard label="With Orders" value={usersWithOrders} />
      </div>

      {/* TABLE */}
      <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-gray-400">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Total Spent</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#76b900]/20 text-primary flex items-center justify-center font-bold">
                      {u.username?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{u.username}</p>
                      {u.address?.fullName && (
                        <p className="text-xs text-gray-400">
                          {u.address.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.isBlocked
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-3">{u.orders?.length || 0}</td>

                <td className="p-3 text-primary font-semibold">
                  ₹{getTotalSpent(u).toLocaleString("en-IN")}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      disabled={isAdminUser(u)}
                      onClick={() => setBlockTarget(u)}
                      className={`px-3 py-1 rounded w-20 ${
                        isAdminUser(u)
                          ? "bg-gray-500/10 text-gray-500"
                          : u.isBlocked
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1 rounded bg-[#76b900]/20 text-primary"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl w-full max-w-2xl p-6 relative">
            {/* CLOSE */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#76b900]/20 text-primary flex items-center justify-center text-xl font-bold">
                {selectedUser.username?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedUser.username}
                </h2>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoBox
                label="Status"
                value={selectedUser.isBlocked ? "Blocked" : "Active"}
              />
              <InfoBox
                label="Orders"
                value={selectedUser.orders?.length || 0}
              />
              <InfoBox
                label="Total Spent"
                value={`₹${getTotalSpent(selectedUser).toLocaleString(
                  "en-IN",
                )}`}
              />
            </div>

            {/* ADDRESS */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Address</h3>
              {selectedUser.address ? (
                <div className="border border-white/10 rounded p-3 text-sm text-gray-300">
                  <p className="font-medium">{selectedUser.address.fullName}</p>
                  <p>{selectedUser.address.address}</p>
                  <p>
                    {selectedUser.address.city} – {selectedUser.address.pincode}
                  </p>
                  <p>📞 {selectedUser.address.mobileNumber}</p>
                </div>
              ) : (
                <p className="text-gray-500">No address saved</p>
              )}
            </div>

            {/* RECENT ORDERS */}
            <div>
              <p className="font-semibold mb-2">Recent Orders</p>

              {getRecentOrders(selectedUser).length > 0 ? (
                <div className="space-y-2">
                  {getRecentOrders(selectedUser).map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between border border-white/10 rounded px-3 py-2"
                    >
                      <span className="text-sm text-white font-medium">
                        #{o.id}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded capitalize ${
                          o.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : o.status === "shipped"
                              ? "bg-blue-500/20 text-blue-400"
                              : o.status === "delivered"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= BLOCK CONFIRM ================= */}
      {blockTarget && (
        <ConfirmModal
          open={true}
          title={`${blockTarget.isBlocked ? "Unblock" : "Block"} User`}
          confirmText={blockTarget.isBlocked ? "Unblock" : "Block"}
          cancelText="Cancel"
          onConfirm={async () => {
            await api.patch(`/users/${blockTarget.id}`, {
              isBlocked: !blockTarget.isBlocked,
            });
            toast.success("User updated");
            setBlockTarget(null);
            fetchUsers();
          }}
          onCancel={() => setBlockTarget(null)}
          message={`Are you sure you want to ${
            blockTarget.isBlocked ? "unblock" : "block"
          } ${blockTarget.username}?`}
        />
      )}
    </div>
  );
};

/* STAT CARD */
const StatCard = ({ label, value }: StatCardProps) => (
  <div className="bg-[#0b0b0b] border border-[#76b900]/20 rounded-xl p-4">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const InfoBox = ({ label, value }: InfoBoxProps) => (
  <div className="border border-white/10 rounded p-3">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default Users;
