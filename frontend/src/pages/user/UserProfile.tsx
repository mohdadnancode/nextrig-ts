import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useAuth } from "../../context/Auth/useAuth";
import api from "../../api/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User2, Shield, MapPin, Plus, ArrowRight } from "lucide-react";
import { AddressCard } from "../../components/AddressCard";
import { AddressForm } from "../../components/AddressForm";
import type { Address, AddressFormData } from "../../types/address";

type Tab = "profile" | "security" | "addresses";

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username ?? "");
    setPreview(user.profileImage?.url ?? "");
  }, [user]);

  /* ── Guards ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Shield size={28} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-5">
            Sign in to view your profile
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#68a500] transition"
          >
            Sign in <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  /* ── Profile save ── */
  const handleSaveProfile = async () => {
    if (!username.trim()) { toast.error("Username is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("username", username);
      if (imageFile) fd.append("image", imageFile);
      await api.patch(`/users/${user._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  /* ── Password save ── */
  const handleSavePassword = async () => {
    if (!currentPassword) { toast.error("Enter current password"); return; }
    if (newPassword.length < 6) { toast.error("New password must be 6+ characters"); return; }
    setSaving(true);
    try {
      await api.patch(`/users/${user._id}`, { currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to update password";
      toast.error(msg);
    } finally { setSaving(false); }
  };

  /* ── Address actions ── */
  const handleAddAddress = async (data: AddressFormData, makePrimary: boolean) => {
    setAddressLoading(true);
    try {
      await api.post("/users/address", { ...data, isPrimary: makePrimary });
      toast.success("Address added");
      setShowAddForm(false);
      // Trigger AuthProvider to refresh user
      window.dispatchEvent(new Event("refresh-user"));
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to add address";
      toast.error(msg);
    } finally { setAddressLoading(false); }
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    if (!editingAddress) return;
    setAddressLoading(true);
    try {
      await api.put(`/users/address/${editingAddress._id}`, data);
      toast.success("Address updated");
      setEditingAddress(null);
      window.dispatchEvent(new Event("refresh-user"));
    } catch { toast.error("Failed to update address"); }
    finally { setAddressLoading(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/address/${id}`);
      toast.success("Address removed");
      window.dispatchEvent(new Event("refresh-user"));
    } catch { toast.error("Failed to delete address"); }
    finally { setDeletingId(null); }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await api.patch(`/users/address/${id}/primary`);
      toast.success("Default address updated");
      window.dispatchEvent(new Event("refresh-user"));
    } catch { toast.error("Failed to update default"); }
  };

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max file size is 5 MB"); return; }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ── Nav tabs ── */
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile",   label: "Profile",   icon: <User2 size={14} /> },
    { key: "security",  label: "Security",  icon: <Shield size={14} /> },
    { key: "addresses", label: "Addresses", icon: <MapPin size={14} /> },
  ];

  const inputCls =
    "w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {/* Avatar */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 hover:border-primary/40 overflow-hidden cursor-pointer group flex-shrink-0 transition"
          >
            {preview ? (
              <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/60">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <span className="text-[10px] text-white font-medium">Change</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />

          <div>
            <h1 className="text-xl font-bold text-white">{user.username}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                tab === t.key
                  ? "bg-primary text-black shadow-[0_0_12px_rgba(118,185,0,0.25)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                placeholder="Your username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className={`${inputCls} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === "security" && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5">
            <p className="text-xs text-gray-500">
              Leave both fields empty if you don't want to change your password.
            </p>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSavePassword}
              disabled={saving}
              className="w-full py-3 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] disabled:opacity-50 transition"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* ── ADDRESSES TAB ── */}
        {tab === "addresses" && (
          <div className="space-y-3">
            {/* Sorted: primary first */}
            {[...user.addresses]
              .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
              .map((addr) =>
                editingAddress?._id === addr._id ? (
                  <AddressForm
                    key={addr._id}
                    initial={addr}
                    showPrimaryToggle={false}
                    submitLabel="Update Address"
                    loading={addressLoading}
                    onSubmit={(data) => handleUpdateAddress(data)}
                    onCancel={() => setEditingAddress(null)}
                  />
                ) : (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    mode="manage"
                    deleting={deletingId === addr._id}
                    onEdit={() => setEditingAddress(addr)}
                    onDelete={() => handleDeleteAddress(addr._id)}
                    onSetPrimary={() => handleSetPrimary(addr._id)}
                  />
                )
              )}

            {/* Add new */}
            {showAddForm ? (
              <AddressForm
                loading={addressLoading}
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddForm(false)}
              />
            ) : user.addresses.length < 4 ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-primary/40 text-gray-500 hover:text-primary text-sm flex items-center justify-center gap-2 transition"
              >
                <Plus size={15} />
                Add New Address
                <span className="text-xs text-gray-600">
                  ({user.addresses.length}/4)
                </span>
              </button>
            ) : (
              <p className="text-center text-xs text-gray-600 py-2">
                Maximum 4 addresses reached
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;