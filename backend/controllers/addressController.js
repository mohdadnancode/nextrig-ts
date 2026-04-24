import User from "../models/userModel.js";

// helpers

const MAX_ADDRESSES = 4;

const validateAddressFields = (body) => {
  const { fullName, address, city, pincode, mobileNumber } = body;
  if (!fullName?.trim())     return "Full name is required";
  if (!address?.trim())      return "Address is required";
  if (!city?.trim())         return "City is required";
  if (!/^\d{6}$/.test(pincode))        return "Pincode must be 6 digits";
  if (!/^\d{10}$/.test(mobileNumber))  return "Mobile number must be 10 digits";
  return null;
};

// POST
// Add a new address. If it's the user's first address, auto-set isPrimary.
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.addresses.length >= MAX_ADDRESSES) {
      return res.status(400).json({
        message: `You can save a maximum of ${MAX_ADDRESSES} addresses`,
      });
    }

    const error = validateAddressFields(req.body);
    if (error) return res.status(400).json({ message: error });

    const { fullName, address, city, pincode, mobileNumber } = req.body;

    // First address is always primary
    const isPrimary = user.addresses.length === 0 ? true : !!req.body.isPrimary;

    // If this one is primary, demote all others
    if (isPrimary) {
      user.addresses.forEach((a) => { a.isPrimary = false; });
    }

    user.addresses.push({ fullName, address, city, pincode, mobileNumber, isPrimary });
    await user.save();

    res.status(201).json(user.addresses);
  } catch (err) {
    console.error("ADD ADDRESS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// PUT
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);

    if (!addr) return res.status(404).json({ message: "Address not found" });

    const error = validateAddressFields(req.body);
    if (error) return res.status(400).json({ message: error });

    const { fullName, address, city, pincode, mobileNumber } = req.body;
    addr.set({ fullName, address, city, pincode, mobileNumber });

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);

    if (!addr) return res.status(404).json({ message: "Address not found" });

    const wasPrimary = addr.isPrimary;
    addr.deleteOne();

    // If we deleted the primary, promote the first remaining one
    if (wasPrimary && user.addresses.length > 0) {
      user.addresses[0].isPrimary = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH
export const setPrimaryAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);

    if (!addr) return res.status(404).json({ message: "Address not found" });

    // Demote all, promote this one
    user.addresses.forEach((a) => { a.isPrimary = false; });
    addr.isPrimary = true;

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error("SET PRIMARY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};