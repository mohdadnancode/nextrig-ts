import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useAuth } from "../../context/Auth/useAuth";
import api from "../../api/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User2,
  Shield,
  MapPin,
  Plus,
  ArrowRight,
  Camera,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { AddressCard } from "../../components/AddressCard";
import { AddressForm } from "../../components/AddressForm";
import type { Address, AddressFormData } from "../../types/address";

type Tab = "profile" | "security" | "addresses";

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "reserved"
  >("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);

  /* ── Username local validation (mirrors Register Yup rules) ── */
  const getUsernameError = (u: string): string | null => {
    if (u.length > 0 && u.length < 3)
      return "Username must be at least 3 characters";
    if (u.length >= 3 && !/^[a-z]/.test(u))
      return "Username must start with a letter";
    if (u.length >= 3 && !/^[a-z0-9_]*$/.test(u))
      return "Only lowercase letters, numbers, and underscores";
    return null;
  };
  const usernameLocalError = getUsernameError(username);
  const getPasswordStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const pwStrength = getPasswordStrength(newPassword);
  const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwStrengthColor = [
    "",
    "text-red-400",
    "text-yellow-400",
    "text-yellow-300",
    "text-green-400",
  ][pwStrength];
  const pwBarColor = (i: number) =>
    pwStrength >= i
      ? pwStrength <= 2
        ? "bg-red-500"
        : pwStrength === 3
          ? "bg-yellow-400"
          : "bg-green-400"
      : "bg-white/10";

  const getNewPasswordError = (p: string): string | null => {
    if (!p) return null;
    if (p.length < 8) return "At least 8 characters";
    if (!/[A-Z]/.test(p)) return "Must include an uppercase letter";
    if (!/[0-9]/.test(p)) return "Must include a number";
    if (!/[^A-Za-z0-9]/.test(p)) return "Must include a special character";
    return null;
  };
  const newPasswordError = newPasswordTouched
    ? getNewPasswordError(newPassword)
    : null;

  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username ?? "");
    setPreview(user.profileImage?.url ?? "");
  }, [user]);

  /* ── Stable ref for current username so effect doesn't re-run on user object changes ── */
  const currentUsernameRef = useRef<string>("");
  useEffect(() => {
    if (user?.username) currentUsernameRef.current = user.username;
  }, [user?.username]);

  /* ── Username real-time check ── */
  useEffect(() => {
    const trimmed = username.trim();

    // Same as what's saved — no check needed
    if (trimmed.toLowerCase() === currentUsernameRef.current.toLowerCase()) {
      setUsernameStatus("idle");
      return;
    }

    // Too short — skip API
    if (trimmed.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    // Local format error — skip API (shown via usernameLocalError)
    if (getUsernameError(trimmed)) {
      setUsernameStatus("idle");
      return;
    }

    // Valid format — fire debounced API check
    setUsernameStatus("checking");

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(
          `/users/check-username/${trimmed.toLowerCase()}`,
        );
        if (cancelled) return;
        if (res.data.reason === "reserved") {
          setUsernameStatus("reserved");
        } else if (res.data.available === false) {
          setUsernameStatus("taken");
        } else if (res.data.available === true) {
          setUsernameStatus("available");
        }
      } catch {
        if (!cancelled) setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]); // ← only username, not user object

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
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    const localErr = getUsernameError(username);
    if (localErr) {
      toast.error(localErr);
      return;
    }
    if (usernameStatus === "taken") {
      toast.error("Username already exists");
      return;
    }
    if (usernameStatus === "reserved") {
      toast.error("This username is not allowed");
      return;
    }
    if (usernameStatus === "checking") {
      toast.error("Please wait while we check the username");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("username", username);
      if (imageFile) fd.append("image", imageFile);
      await api.patch(`/users/${user._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated");
      setImageFile(null);
      window.dispatchEvent(new Event("refresh-user"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Remove profile image ── */
  const handleRemoveImage = async () => {
    setRemovingImage(true);
    try {
      await api.delete(`/users/${user._id}/profile-image`);
      setPreview("");
      setImageFile(null);
      toast.success("Profile picture removed");
      window.dispatchEvent(new Event("refresh-user"));
    } catch {
      toast.error("Failed to remove profile picture");
    } finally {
      setRemovingImage(false);
    }
  };

  /* ── Password save ── */
  const handleSavePassword = async () => {
    if (!currentPassword) {
      toast.error("Enter current password");
      return;
    }
    setNewPasswordTouched(true);
    const err = getNewPasswordError(newPassword);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/users/${user._id}`, { currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordTouched(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update password";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Address actions ── */
  const handleAddAddress = async (
    data: AddressFormData,
    makePrimary: boolean,
  ) => {
    setAddressLoading(true);
    try {
      await api.post("/users/address", { ...data, isPrimary: makePrimary });
      toast.success("Address added");
      setShowAddForm(false);
      window.dispatchEvent(new Event("refresh-user"));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add address";
      toast.error(msg);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    if (!editingAddress) return;
    setAddressLoading(true);
    try {
      await api.put(`/users/address/${editingAddress._id}`, data);
      toast.success("Address updated");
      setEditingAddress(null);
      window.dispatchEvent(new Event("refresh-user"));
    } catch {
      toast.error("Failed to update address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/address/${id}`);
      toast.success("Address removed");
      window.dispatchEvent(new Event("refresh-user"));
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await api.patch(`/users/address/${id}/primary`);
      toast.success("Default address updated");
      window.dispatchEvent(new Event("refresh-user"));
    } catch {
      toast.error("Failed to update default");
    }
  };

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5 MB");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ── Nav tabs ── */
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User2 size={14} /> },
    { key: "security", label: "Security", icon: <Shield size={14} /> },
    { key: "addresses", label: "Addresses", icon: <MapPin size={14} /> },
  ];

  const inputCls =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition";

  const hasImage = !!preview;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* ── Hero card: avatar right, info left ── */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-6">
            {/* Left: name + email + tab strip */}
            <div className="min-w-0">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                Account
              </p>
              <h1 className="text-2xl font-bold text-white truncate">
                {user.username}
              </h1>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {user.email}
              </p>

              {/* Tabs */}
              <div className="flex gap-1 mt-5 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl w-fit">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      tab === t.key
                        ? "bg-primary text-black shadow-[0_0_10px_rgba(118,185,0,0.2)]"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: avatar */}
            <div className="flex flex-col items-center gap-2.5 shrink-0">
              {/* Avatar circle */}
              <div className="relative w-24 h-24 rounded-full bg-white/[0.05] border-2 border-white/10 overflow-hidden group">
                {hasImage ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/50">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] hover:border-primary/40 hover:text-primary text-gray-400 text-[11px] font-medium transition"
                >
                  <Camera size={11} />
                  Update
                </button>
                {hasImage && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={removingImage}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/[0.08] border border-red-500/20 hover:border-red-500/50 text-red-400 text-[11px] font-medium transition disabled:opacity-50"
                  >
                    <Trash2 size={11} />
                    {removingImage ? "..." : "Remove"}
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Profile Info</h2>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const raw = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, "");
                    setUsername(raw);
                  }}
                  className={`${inputCls} pr-10 ${
                    usernameStatus === "available"
                      ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
                      : usernameLocalError ||
                          usernameStatus === "taken" ||
                          usernameStatus === "reserved"
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                  }`}
                  placeholder="your_username"
                />
                {/* Status icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {!usernameLocalError && usernameStatus === "checking" && (
                    <Loader2 size={14} className="text-gray-400 animate-spin" />
                  )}
                  {!usernameLocalError && usernameStatus === "available" && (
                    <div className="w-[20px] h-[20px] rounded-full border-2 border-green-400 flex items-center justify-center">
                      <Check
                        size={11}
                        className="text-green-400"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                  {(usernameLocalError ||
                    usernameStatus === "taken" ||
                    usernameStatus === "reserved") &&
                    username.length > 0 && (
                      <div className="w-[20px] h-[20px] rounded-full border-2 border-red-400 flex items-center justify-center">
                        <X size={11} className="text-red-400" strokeWidth={3} />
                      </div>
                    )}
                </div>
              </div>

              {/* Status / validation messages — local errors take priority */}
              {username.length > 0 && usernameLocalError && (
                <p className="text-xs text-red-400 mt-1.5">
                  {usernameLocalError}
                </p>
              )}
              {!usernameLocalError && usernameStatus === "available" && (
                <p className="text-xs text-green-400 mt-1.5">
                  Username available
                </p>
              )}
              {!usernameLocalError && usernameStatus === "taken" && (
                <p className="text-xs text-red-400 mt-1.5">
                  Username already exists
                </p>
              )}
              {!usernameLocalError && usernameStatus === "reserved" && (
                <p className="text-xs text-red-400 mt-1.5">
                  This username is not allowed
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className={`${inputCls} opacity-40 cursor-not-allowed select-none`}
              />
              <p className="text-[11px] text-gray-600 mt-1">
                Email cannot be changed
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={
                saving ||
                !!usernameLocalError ||
                usernameStatus === "checking" ||
                usernameStatus === "taken" ||
                usernameStatus === "reserved"
              }
              className="w-full py-2.5 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_14px_rgba(118,185,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === "security" && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">
              Change Password
            </h2>
            <p className="text-xs text-gray-600">
              Leave both fields empty if you don't want to change your password.
            </p>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
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
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordTouched(true);
                  }}
                  placeholder="Min. 8 characters"
                  className={`${inputCls} pr-10 ${
                    newPasswordError
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      : newPassword && !newPasswordError
                        ? "border-green-500/40 focus:border-green-500 focus:ring-green-500/20"
                        : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${pwBarColor(i)}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${pwStrengthColor}`}>
                    {pwStrengthLabel} password
                  </p>
                </>
              )}

              {newPasswordError && (
                <p className="text-xs text-red-400 mt-1.5">
                  {newPasswordError}
                </p>
              )}
            </div>
            <button
              onClick={handleSavePassword}
              disabled={saving}
              className="w-full py-2.5 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_14px_rgba(118,185,0,0.3)] disabled:opacity-50 transition"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {/* ── ADDRESSES TAB ── */}
        {tab === "addresses" && (
          <div className="space-y-3">
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
                ),
              )}

            {showAddForm ? (
              <AddressForm
                loading={addressLoading}
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddForm(false)}
              />
            ) : user.addresses.length < 4 ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 rounded-xl border border-dashed border-white/[0.12] hover:border-primary/40 text-gray-500 hover:text-primary text-sm flex items-center justify-center gap-2 transition"
              >
                <Plus size={14} />
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
