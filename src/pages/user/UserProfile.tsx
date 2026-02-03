import { useState, useEffect, type ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import type { User, Address } from "../../types/user";

interface ProfileFormData {
  username: string;
  email: string;
  password: string;
  address: Address;
}

const emptyAddress: Address = {
  fullName: "",
  address: "",
  city: "",
  pincode: "",
  mobileNumber: "",
};

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    email: "",
    password: "",
    address: { ...emptyAddress },
  });

  const [profileImage, setProfileImage] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      username: user.username ?? "",
      email: user.email ?? "",
      password: "",
      address: user.address ?? { ...emptyAddress },
    });

    setProfileImage(user.profileImage ?? "");
  }, [user]);

  /* ---------------- Handlers ---------------- */

  type ProfileInputName = "username" | "email" | "password";

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement & { name: ProfileInputName }>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- Validation ---------------- */

  const validateForm = (): boolean => {
    const { username, email, address } = formData;

    if (!username.trim()) {
      alert("Username is required");
      return false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Invalid email address");
      return false;
    }

    if (address.mobileNumber && address.mobileNumber.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return false;
    }

    if (address.pincode && address.pincode.length !== 6) {
      alert("Enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  /* ---------------- Save ---------------- */

  const handleSaveChanges = async () => {
    if (!user || !validateForm()) return;

    setSaving(true);

    const password = formData.password.trim() || user.password;

    try {
      const updatedUser: User = {
        ...user,
        username: formData.username,
        email: formData.email,
        profileImage,
        address: formData.address,
        password,
        updatedAt: new Date().toISOString(),
      };

      const res = await api.put<User>(`/users/${user.id}`, updatedUser);

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
      setFormData((p) => ({ ...p, password: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Guards ---------------- */

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-[#76b900] text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold mb-4">
            Please log in to view your profile
          </h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 py-8 px-4 mt-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#76b900] text-center mb-8">
          Profile Settings
        </h1>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
          {/* Profile Picture */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-[#76b900]/30 overflow-hidden mx-auto mb-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    👤
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="bg-[#76b900] text-black font-semibold py-2 px-4 rounded-lg hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform cursor-pointer">
                  Change Photo
                </span>
              </label>
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div>
              <h2 className="text-2xl font-semibold text-[#76b900] mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                    placeholder="Enter new password (optional)"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Leave blank to keep current password
                  </p>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h2 className="text-2xl font-semibold text-[#76b900] mb-6">
                Address Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.address.fullName}
                    onChange={handleAddressChange}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                    placeholder="Enter full name for delivery"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address.address}
                    onChange={handleAddressChange}
                    rows={3}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.address.pincode}
                      onChange={handleAddressChange}
                      maxLength={6}
                      className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.address.mobileNumber}
                    onChange={handleAddressChange}
                    maxLength={10}
                    className="w-full bg-transparent border border-white/20 rounded-lg p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="w-full bg-[#76b900] text-black font-bold py-4 px-6 rounded-lg hover:shadow-[0_0_20px_#76b900] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <p className="text-gray-400 text-sm text-center mt-3">
              * Required fields
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
